<script setup lang="ts">
import { computed } from 'vue'

interface IColumnConfig {
	key: string;
	label: string;
	width?: string;
	minWidth?: string;
	maxWidth?: string;
	align?: 'left' | 'center' | 'right';
	verticalAlign?: 'top' | 'middle' | 'bottom';
	class?: string;
}

const { data, columns, width = '100%', maxWidth = '100%' } = defineProps<{
	// Данные для таблицы
	data: any[];
	// Конфигурация колонок
	columns: IColumnConfig[];
	// Ширина таблицы
	width?: string;
	// Максимальная ширина таблицы
	maxWidth?: string;
}>()


// Стили для контейнера таблицы
const containerStyle = computed(() => {
	return `max-width: ${maxWidth}; width: ${width};`;
});


// Генерируем стили для ячейки
const getCellStyle = (column: IColumnConfig, rowIndex: number) => {
	const styles: string[] = [];
	
	if (column.width) {
		styles.push(`width: ${column.width}`);
	}
	if (column.minWidth) {
		styles.push(`min-width: ${column.minWidth}`);
	}
	if (column.maxWidth) {
		styles.push(`max-width: ${column.maxWidth}`);
	}

	if (column.verticalAlign) {
		styles.push(`vertical-align: ${column.verticalAlign}`);
	}
	
	return styles.join('; ');
};

// Генерируем стили для заголовка
const getHeaderStyle = (column: IColumnConfig) => {
	const styles: string[] = [];
	
	if (column.width) {
		styles.push(`width: ${column.width}`);
	}
	if (column.minWidth) {
		styles.push(`min-width: ${column.minWidth}`);
	}
	if (column.maxWidth) {
		styles.push(`max-width: ${column.maxWidth}`);
	}

	
	return styles.join('; ');
};

// Эмиты
const emit = defineEmits<{
	cellClick: [rowData: any, column: IColumnConfig, rowIndex: number];
	rowClick: [rowData: any, rowIndex: number];
}>();

const handleCellClick = (rowData: any, column: IColumnConfig, rowIndex: number) => {
	emit('cellClick', rowData, column, rowIndex);
};

const handleRowClick = (rowData: any, rowIndex: number) => {
	emit('rowClick', rowData, rowIndex);
};
</script>

<template>
	<div class="universal-table" :style="containerStyle">
		<table 
			class="v-table" 
		>
			<!-- Заголовок таблицы -->
			<thead>
				<tr>
					<th 
						v-for="(column, index) in columns" 
						:key="`header-${index}`"
						:style="getHeaderStyle(column)"
					>
						<slot 
							:name="`header-${column.key}`" 
							:column="column" 
							:index="index"
						>
							{{ column.label }}
						</slot>
					</th>
				</tr>
			</thead>
			
			<!-- Тело таблицы -->
			<tbody>
				<tr 
					v-for="(row, rowIndex) in data" 
					:key="`row-${rowIndex}`"
					@click="handleRowClick(row, rowIndex)"
				>
					<td 
						v-for="(column, colIndex) in columns" 
						:key="`cell-${rowIndex}-${colIndex}`"
						:style="getCellStyle(column, rowIndex)"
						@click="handleCellClick(row, column, rowIndex)"
					>
						<!-- Слот для кастомного содержимого ячейки -->
						<slot 
							:name="`cell-${column.key}`"
							:item="row"
							:value="row[column.key]"
							:column="column"
							:index="rowIndex"
							:row-index="rowIndex"
							:col-index="colIndex"
						>
							<!-- Слот по умолчанию для всех ячеек -->
							<slot 
								name="default" 
								:item="row"
								:value="row[column.key]"
								:column="column"
								:index="rowIndex"
								:row-index="rowIndex"
								:col-index="colIndex"
							>
								{{ row[column.key] }}
							</slot>
						</slot>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<style lang="scss" scoped>
.v-table { 
	width: 100%; 
	border-collapse: collapse;
	thead {
		th {
			padding: 0 8px;
		}
	}

	thead, tfoot {
		background: #2c2438;
		vertical-align: middle;
		cursor: pointer;
		height: 28px;
		text-align: left;
		th, td {
			font-weight: 600;
			font-size: 15px;
			color: #fff;
			vertical-align: middle;
		}
	}

	tbody {
		tr {
			td, th {
				&:not(:last-of-type) {
					border-right: 1px solid #cdcdcd;
				}
			}
			&:nth-child(even){
				background: #f7f7f7;
			}
		}
		td {
			padding: 6px 8px;
			font-size: 15px;
			font-weight: 400;
			vertical-align: middle;
		}
		td.no-padding {
			padding: 0;
		}
		td.max-content {
			min-width: max-content;
		}
	}
}
</style> 
