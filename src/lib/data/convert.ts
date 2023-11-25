import Excel from 'exceljs';
import Papa from 'papaparse';

export const jsonToExcel = async (rows: Record<string, unknown>[]) => {
  const workbook = new Excel.Workbook();
  const worksheet = workbook.addWorksheet('Sheet1');
  const dataKeys = Object.keys(rows[0]);
  const dataValues = rows.map(Object.values);
  worksheet.addRow(dataKeys);
  worksheet.addRows(dataValues);
  // worksheet.getCell('A2').fill = {
  //   type: 'pattern',
  //   pattern: 'solid',
  //   fgColor: { argb: 'FFC7CD' },
  // };
  // worksheet.getCell('A2').font = {
  //   color: { argb: '9C0007' },
  // };
  return await workbook.xlsx.writeBuffer();
};

export const excelToJSON = async (workbook: Excel.Workbook, sheetName = '') => {
  const config = { header: true, dynamicTyping: true, skipEmptyLines: true };
  let buffer: ArrayBuffer;
  if (sheetName) buffer = await workbook.csv.writeBuffer({ sheetName });
  else buffer = await workbook.csv.writeBuffer();
  return Papa.parse(buffer.toString(), config).data;
};

export const fileToJSON = (file: File): Promise<JSON> => {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = () => resolve(JSON.parse(reader.result));
    reader.onerror = reject;
    reader.readAsText(file);
  });
};

export const fileToBuffer = (file: File): Promise<ArrayBuffer> => {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};
