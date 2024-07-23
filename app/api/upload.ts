// import { NextApiRequest, NextApiResponse } from 'next';
// import { IncomingForm, Fields, Files } from 'formidable';
// import fs from 'fs';
// import path from 'path';
// import { addUploadedFile } from '@/utils/database';

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ error: 'Método no permitido' });
//   }

//   const form = new IncomingForm();
  
//   form.parse(req, async (err: Error | null, fields: Fields, files: Files) => {
//     if (err) {
//       console.error('Error parsing form:', err);
//       return res.status(500).json({ error: 'Error al procesar el archivo' });
//     }

//     const file = Array.isArray(files.file) ? files.file[0] : files.file;
    
//     if (!file) {
//       return res.status(400).json({ error: 'Archivo no proporcionado o formato incorrecto' });
//     }

//     const originalFilename = file.originalFilename || 'unknown';
//     const fileType = file.mimetype || 'unknown';
//     const newFilename = `${Date.now()}-${originalFilename}`;
//     const uploadDir = path.join(process.cwd(), 'uploads');
//     const newFilePath = path.join(uploadDir, newFilename);

//     try {
//       // Asegúrate de que el directorio de uploads existe
//       if (!fs.existsSync(uploadDir)) {
//         fs.mkdirSync(uploadDir, { recursive: true });
//       }

//       // Mover el archivo a la carpeta de uploads
//       fs.renameSync(file.filepath, newFilePath);

//       // Guardar la información del archivo en la base de datos
//       const fileData = {
//         fileName: originalFilename,
//         fileType: fileType,
//         filePath: newFilePath,
//         uploadDate: new Date().toISOString(),
//         processedData: null, // Inicialmente no hay datos procesados
//         personnelId: fields.personnelId && !Array.isArray(fields.personnelId) 
//           ? Number(fields.personnelId) 
//           : null
//       };

//       const fileId = await addUploadedFile(fileData);

//       res.status(200).json({ 
//         message: 'Archivo subido y registrado con éxito',
//         fileId: fileId,
//         fileName: originalFilename
//       });
//     } catch (error) {
//       console.error('Error processing file:', error);
//       res.status(500).json({ error: 'Error al procesar y guardar el archivo' });
//     }
//   });
// }