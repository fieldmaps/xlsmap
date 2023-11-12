import Excel from 'exceljs';
import Papa from 'papaparse';

const config = { header: true, dynamicTyping: true, skipEmptyLines: true };

export const toJSON = async (workbook: Excel.Workbook) => {
  const buffer = await workbook.csv.writeBuffer();
  return Papa.parse(buffer.toString(), config).data;
};

export const toXLSX = async (rows) => {
  const workbook = new Excel.Workbook();
  const worksheet = workbook.addWorksheet('Sheet1');
  const dataKeys = Object.keys(rows[0]);
  const dataValues = rows.map(Object.values);
  worksheet.addRow(dataKeys);
  worksheet.addRows(dataValues);
  return await workbook.xlsx.writeBuffer();
};
