import { createReport } from 'docx-templates';
import fs from 'node:fs';
const template = fs.readFileSync('config/srs-template.docx');
const doc = {
  funcName:'Quản lý danh mục người dùng', screenCode:'ND01', module:'ND',
  purpose:'Tra cứu, thêm, sửa, xóa.', accessRoles:'ADMIN', parentScreen:'Trang chủ',
  childScreens:'Chi tiết', screenType:'Danh sach',
  components:[{stt:1,name:'Ô tìm',type:'Input',required:'Không',desc:'tìm',validation:'—'}],
  flow:[{step:1,actor:'User',action:'Mở',result:'OK'}],
  errors:[{situation:'Lỗi',message:'msg',action:'act'}],
  businessRules:['[BR-01] abc'],
  openQuestions:[{stt:1,topic:'—',content:'q?',asker:'BA',status:'Đang mở'}],
  today:'14/06/2026', author:'[Tên BA]', approver:'[Lead]', hasImage:false,
};
const buf = await createReport({ template, cmdDelimiter:['[[',']]'], data:doc, additionalJsContext:{mockup:()=>null} });
fs.writeFileSync('test-out.docx', buf);
console.log('RENDER OK', buf.length);
