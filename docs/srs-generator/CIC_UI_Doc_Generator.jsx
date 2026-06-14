import { useState, useRef } from "react";

const C = {
  navy:"#1F4E79", blue:"#2E75B6", blueLt:"#D6E4F0", blueXs:"#EEF5FB",
  bg:"#F0F4F8", surface:"#FFFFFF", border:"#CBD5E1",
  text:"#1E293B", muted:"#64748B", red:"#EF4444", green:"#16A34A"
};

function buildConfluence(d) {
  const today = new Date().toLocaleDateString("vi-VN");
  const code = d.screenCode || "SCR-???";
  const mod = d.module || "";
  const esc = v => String(v||"").replace(/\|/g,"\\|");
  const row = (obj, cols) => "| " + cols.map(c => esc(obj[c])).join(" | ") + " |";
  return [
    `h1. ${d.funcName}`,
    `{info:title=Thong tin tai lieu}`,
    `*Ma:* ${code} | *Module:* ${mod} | *Ngay:* ${today} | *Trang thai:* Draft`,
    `{info}`, `----`,
    `h2. 1. Thong tin chung`,
    `h3. 1.1. Muc dich`, d.purpose||"",
    `h3. 1.2. Pham vi ap dung`,
    ...(d.scope||[]).map(s=>`* ${s}`), `----`,
    `h2. 2. ${d.funcName}`,
    `h3. 2.1. Tong quan man hinh`,
    `|| Thuoc tinh || Gia tri ||`,
    `| Ten man hinh | ${esc(d.funcName)} |`,
    `| Ma man hinh | ${code} |`,
    `| Module | ${mod} |`,
    `| Loai man hinh | ${esc(d.screenType)} |`,
    `| Quyen truy cap | ${esc(d.accessRoles)} |`,
    `| Man hinh cha | ${esc(d.parentScreen)||"—"} |`,
    `| Man hinh con | ${esc(d.childScreens)||"—"} |`,
    `h3. 2.2. Mockup / Wireframe`,
    `{note:title=Huong dan}Chen anh bang lenh !ten-file.png!{note}`,
    `h3. 2.3. Danh sach thanh phan UI`,
    `|| STT || Ten thanh phan || Loai || Bat buoc || Mo ta / Gia tri || Validation ||`,
    ...(d.components||[]).map(c => row(c,["stt","name","type","required","desc","validation"])),
    `{note}Cot Bat buoc = Co: truong bat loi khi submit.{note}`,
    `h3. 2.4. Luong xu ly chinh`,
    `|| Buoc || Nguoi thuc hien || Hanh dong || Ket qua / Ghi chu ||`,
    ...(d.flow||[]).map(f => row(f,["step","actor","action","result"])),
    `h3. 2.5. Xu ly loi va thong bao`,
    `|| Tinh huong loi || Thong bao hien thi || Hanh dong he thong ||`,
    ...(d.errors||[]).map(e => row(e,["situation","message","action"])),
    `h3. 2.6. Dieu kien nghiep vu dac biet`,
    ...(d.businessRules||[]).map(r=>`* ${r}`),
    `h3. 2.7. Cau hoi mo / Ghi chu`,
    `|| # || Noi dung || Nguoi hoi || Trang thai ||`,
    ...((d.openQuestions||["(chua co)"]).map((q,i)=>`| ${i+1} | ${q} | BA | Dang mo |`)),
    `----`, `_Sinh tu dong boi CIC UI Doc Generator - ${today}_`
  ].join("\n");
}

const TH = {background:C.navy,color:"white",padding:"7px 10px",textAlign:"left",fontWeight:600,fontSize:12};
const TD = {border:`1px solid ${C.border}`,padding:"6px 10px",verticalAlign:"top",fontSize:12};
const TA = {border:`1px solid ${C.border}`,padding:"6px 10px",verticalAlign:"top",fontSize:12,background:C.blueXs};

function DocPreview({d}) {
  if (!d) return (
    <div style={{padding:60,textAlign:"center",color:C.muted}}>
      <div style={{fontSize:44,marginBottom:12,opacity:.35}}>📝</div>
      <p style={{fontSize:14}}>Xem trước nội dung Word sẽ hiển thị ở đây</p>
    </div>
  );
  const today = new Date().toLocaleDateString("vi-VN");
  const code = d.screenCode||"SCR-???";
  const H2 = t => <h2 style={{color:C.navy,borderBottom:`2px solid ${C.blue}`,paddingBottom:4,fontSize:16,marginTop:20}}>{t}</h2>;
  const H3 = t => <h3 style={{color:C.blue,fontSize:14,marginTop:14}}>{t}</h3>;
  return (
    <div style={{background:"white",border:`1px solid ${C.border}`,borderRadius:8,padding:"24px 28px",maxWidth:720,margin:"0 auto",fontSize:13,lineHeight:1.7}}>
      <div style={{textAlign:"center",marginBottom:20}}>
        <div style={{fontSize:10,color:C.muted,textTransform:"uppercase",letterSpacing:1}}>Trung tâm Thông tin Tín dụng Quốc gia Việt Nam</div>
        <div style={{fontSize:20,fontWeight:700,color:C.navy,margin:"6px 0 3px"}}>{d.funcName}</div>
        <div style={{fontSize:11,color:C.muted}}>{code} · {d.module||""} · {today} · Draft</div>
      </div>
      {H2("1. Thông tin chung")}
      {H3("1.1. Mục đích")}<p>{d.purpose}</p>
      {H3("1.2. Phạm vi")}<ul>{(d.scope||[]).map((s,i)=><li key={i}>{s}</li>)}</ul>
      {H2("2. "+d.funcName)}
      {H3("2.1. Tổng quan màn hình")}
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
        {[["Tên màn hình",d.funcName],["Mã màn hình",code],["Module",d.module||""],
          ["Loại màn hình",d.screenType||""],["Quyền truy cập",d.accessRoles||""],
          ["Màn hình cha",d.parentScreen||"—"],["Màn hình con",d.childScreens||"—"]]
          .map(([k,v],i)=><tr key={i}><td style={{...TD,background:C.blueLt,fontWeight:600,width:160}}>{k}</td><td style={TD}>{v}</td></tr>)}
      </table>
      {H3("2.3. Danh sách thành phần UI")}
      <table style={{width:"100%",borderCollapse:"collapse"}}>
        <thead><tr>{["STT","Tên thành phần","Loại","Bắt buộc","Mô tả","Validation"].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
        <tbody>{(d.components||[]).map((c,i)=>{const t=i%2?TD:TA;return<tr key={i}>
          <td style={t}>{c.stt}</td><td style={t}>{c.name}</td><td style={t}>{c.type}</td>
          <td style={{...t,color:c.required==="Co"||c.required==="Có"?"#C00000":"inherit",fontWeight:c.required==="Co"||c.required==="Có"?700:400}}>{c.required}</td>
          <td style={t}>{c.desc}</td><td style={t}>{c.validation}</td>
        </tr>;})}</tbody>
      </table>
      {H3("2.4. Luồng xử lý chính")}
      <table style={{width:"100%",borderCollapse:"collapse"}}>
        <thead><tr>{["Bước","Người thực hiện","Hành động","Kết quả / Ghi chú"].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
        <tbody>{(d.flow||[]).map((f,i)=>{const t=i%2?TD:TA;return<tr key={i}>
          <td style={t}>{f.step}</td><td style={t}>{f.actor}</td><td style={t}>{f.action}</td><td style={t}>{f.result}</td>
        </tr>;})}</tbody>
      </table>
      {H3("2.5. Xử lý lỗi & thông báo")}
      <table style={{width:"100%",borderCollapse:"collapse"}}>
        <thead><tr>{["Tình huống lỗi","Thông báo hiển thị","Hành động hệ thống"].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
        <tbody>{(d.errors||[]).map((e,i)=>{const t=i%2?TD:TA;return<tr key={i}>
          <td style={t}>{e.situation}</td><td style={t}>{e.message}</td><td style={t}>{e.action}</td>
        </tr>;})}</tbody>
      </table>
      {H3("2.6. Điều kiện nghiệp vụ")}
      <ul>{(d.businessRules||[]).map((r,i)=><li key={i}>{r}</li>)}</ul>
      {H3("2.7. Câu hỏi mở / Ghi chú")}
      <table style={{width:"100%",borderCollapse:"collapse"}}>
        <thead><tr>{["#","Nội dung","Người hỏi","Trạng thái"].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
        <tbody>{(d.openQuestions||["(chưa có)"]).map((q,i)=><tr key={i}>
          <td style={TD}>{i+1}</td><td style={TD}>{q}</td><td style={TD}>BA</td><td style={TD}>Đang mở</td>
        </tr>)}</tbody>
      </table>
    </div>
  );
}

export default function App() {
  const [funcName,   setFuncName]   = useState("");
  const [screenCode, setScreenCode] = useState("");
  const [module,     setModule]     = useState("");
  const [funcDesc,   setFuncDesc]   = useState("");
  const [images,     setImages]     = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [status,     setStatus]     = useState({type:"idle", msg:"Sẵn sàng sinh tài liệu"});
  const [data,       setData]       = useState(null);
  const [confluence, setConfluence] = useState("");
  const [activeTab,  setActiveTab]  = useState("confluence");
  const [copied,     setCopied]     = useState(false);
  const [docxStatus, setDocxStatus] = useState("idle");
  const fileRef = useRef();

  function handleFiles(files) {
    Array.from(files).forEach(file => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = ev => setImages(prev => [...prev, {name:file.name, dataUrl:ev.target.result}]);
      reader.readAsDataURL(file);
    });
    if (fileRef.current) fileRef.current.value = "";
  }

  async function generate() {
    if (!funcName.trim()) { setStatus({type:"error", msg:"Vui lòng nhập tên chức năng"}); return; }
    setLoading(true); setData(null); setConfluence("");
    setStatus({type:"loading", msg:"Đang phân tích và sinh tài liệu..."});
    try {
      const imgNote = images.length > 0
        ? " Has " + images.length + " mockup image(s): " + images.map(i=>i.name).join(", ") + "."
        : " No mockup images.";

      const prompt =
        "You are a Business Analyst at CIC (Vietnam National Credit Information Center). " +
        "Analyze the UI screen below and return ONLY a single valid JSON object. " +
        "No markdown, no backticks, no explanation. Start with { end with }.\n\n" +
        "Screen name: " + funcName + "\n" +
        "Screen code: " + (screenCode||"N/A") + "\n" +
        "Module: " + (module||"N/A") + "\n" +
        "Description: " + (funcDesc||"N/A") + "\n" +
        imgNote + "\n\n" +
        "Return JSON with these exact keys (write all content values in Vietnamese):\n" +
        "funcName, screenCode, module, purpose (1-2 sentences), " +
        "scope (array of strings), screenType (one of: Form nhap lieu/Danh sach/Xem chi tiet/Bao cao/Khac), " +
        "accessRoles (string), parentScreen (string or null), childScreens (string or null), " +
        "components (array, min 5: each has stt/name/type/required/desc/validation), " +
        "flow (array, min 5 steps including 3a success and 3b error: each has step/actor/action/result), " +
        "errors (array, min 3: each has situation/message/action), " +
        "businessRules (array of strings, min 2, prefix each with [BR-0N]), " +
        "openQuestions (array of strings).\n\n" +
        "RETURN ONLY VALID JSON. NO OTHER TEXT.";

      const raw = await window.claude.complete(prompt);
      const j0 = raw.indexOf("{"), j1 = raw.lastIndexOf("}");
      if (j0 === -1 || j1 <= j0) throw new Error("No JSON found in response: " + raw.substring(0,100));
      const result = JSON.parse(raw.slice(j0, j1+1));

      setData(result);
      const cf = buildConfluence(result);
      setConfluence(cf);
      setStatus({type:"done", msg:"Hoàn thành! Sẵn sàng xuất Confluence & Word."});
    } catch(err) {
      setStatus({type:"error", msg:"Lỗi: " + err.message});
    } finally {
      setLoading(false);
    }
  }

  function copyConfluence() {
    navigator.clipboard.writeText(confluence).then(()=>{ setCopied(true); setTimeout(()=>setCopied(false),2500); });
  }

  async function downloadDocx() {
    if (!data) return;
    setDocxStatus("building");
    try {
      const d = data;
      const today = new Date().toLocaleDateString("vi-VN");
      const code  = d.screenCode || "SCR-???";

      // ── helpers ──────────────────────────────────────────────────────
      const esc = s => String(s||"")
        .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
        .replace(/"/g,"&quot;").replace(/'/g,"&apos;");

      const rgb = hex => {
        const r = parseInt(hex.slice(0,2),16), g = parseInt(hex.slice(2,4),16), b = parseInt(hex.slice(4,6),16);
        return `${r},${g},${b}`;
      };

      // ── paragraph styles ──────────────────────────────────────────────
      const para = (text, opts={}) => {
        const sz   = opts.sz   || 22;
        const bold = opts.bold ? "<w:b/>" : "";
        const clr  = opts.clr  ? `<w:color w:val="${opts.clr}"/>` : "";
        const jc   = opts.center ? `<w:jc w:val="center"/>` : "";
        const sb   = opts.sb   ? `<w:before w:val="${opts.sb}"/>` : "";
        const sa   = opts.sa   ? `<w:after w:val="${opts.sa}"/>` : "";
        const spc  = (sb||sa)  ? `<w:spacing ${sb} ${sa}/>` : "";
        const bdr  = opts.bdr  ? `<w:pBdr><w:bottom w:val="single" w:sz="6" w:space="4" w:color="2E75B6"/></w:pBdr>` : "";
        const lvl  = opts.lvl !== undefined ? `<w:outlineLvl w:val="${opts.lvl}"/>` : "";
        return `<w:p>
          <w:pPr>${jc}${spc}${bdr}${lvl}</w:pPr>
          <w:r><w:rPr>${bold}${clr}<w:sz w:val="${sz}"/><w:szCs w:val="${sz}"/></w:rPr>
          <w:t xml:space="preserve">${esc(text)}</w:t></w:r>
        </w:p>`;
      };

      const emptyPara = () => `<w:p><w:pPr><w:spacing w:before="60" w:after="60"/></w:pPr></w:p>`;

      const h1 = t => para(t, {sz:36,bold:true,clr:"1F4E79",sb:"400",sa:"200",bdr:true,lvl:0});
      const h2 = t => para(t, {sz:28,bold:true,clr:"2E75B6",sb:"280",sa:"140",lvl:1});
      const h3 = t => para(t, {sz:24,bold:true,clr:"1F4E79",sb:"200",sa:"100",lvl:2});

      const bullet = t => `<w:p>
        <w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr>
        <w:spacing w:before="60" w:after="60"/></w:pPr>
        <w:r><w:rPr><w:sz w:val="20"/><w:szCs w:val="20"/></w:rPr>
        <w:t xml:space="preserve">${esc(t)}</w:t></w:r>
      </w:p>`;

      // ── table helpers ─────────────────────────────────────────────────
      const tcPr = (w, fill, bold=false) => `<w:tcPr>
        <w:tcW w:w="${w}" w:type="dxa"/>
        <w:shd w:val="clear" w:color="auto" w:fill="${fill}"/>
        <w:tcMar><w:top w:w="90" w:type="dxa"/><w:bottom w:w="90" w:type="dxa"/>
        <w:left w:w="130" w:type="dxa"/><w:right w:w="130" w:type="dxa"/></w:tcMar>
      </w:tcPr>`;

      const hdrCell = (text, w) => `<w:tc>${tcPr(w,"1F4E79")}
        <w:p><w:pPr><w:jc w:val="center"/></w:pPr>
        <w:r><w:rPr><w:b/><w:color w:val="FFFFFF"/><w:sz w:val="18"/><w:szCs w:val="18"/></w:rPr>
        <w:t xml:space="preserve">${esc(text)}</w:t></w:r></w:p></w:tc>`;

      const datCell = (text, w, fill="FFFFFF", center=false) => `<w:tc>${tcPr(w,fill)}
        <w:p>${center?'<w:pPr><w:jc w:val="center"/></w:pPr>':''}
        <w:r><w:rPr><w:sz w:val="18"/><w:szCs w:val="18"/></w:rPr>
        <w:t xml:space="preserve">${esc(text)}</w:t></w:r></w:p></w:tc>`;

      const tblBorders = `<w:tblBorders>
        <w:top w:val="single" w:sz="4" w:color="BDD7EE"/>
        <w:left w:val="single" w:sz="4" w:color="BDD7EE"/>
        <w:bottom w:val="single" w:sz="4" w:color="BDD7EE"/>
        <w:right w:val="single" w:sz="4" w:color="BDD7EE"/>
        <w:insideH w:val="single" w:sz="4" w:color="BDD7EE"/>
        <w:insideV w:val="single" w:sz="4" w:color="BDD7EE"/>
      </w:tblBorders>`;

      const alt = i => i%2===0 ? "F5FAFF" : "FFFFFF";

      // ── component table ───────────────────────────────────────────────
      const compCols = [500,1700,1200,900,2460,2600];
      const compTbl = `<w:tbl>
        <w:tblPr><w:tblW w:w="9360" w:type="dxa"/>${tblBorders}</w:tblPr>
        <w:tblGrid>${compCols.map(w=>`<w:gridCol w:w="${w}"/>`).join("")}</w:tblGrid>
        <w:tr><w:trPr><w:tblHeader/></w:trPr>
          ${["STT","Tên thành phần","Loại","Bắt buộc","Mô tả / Giá trị","Validation"].map((h,i)=>hdrCell(h,compCols[i])).join("")}
        </w:tr>
        ${(d.components||[]).map((c,i)=>`<w:tr>
          ${datCell(c.stt||"",       compCols[0],alt(i),true)}
          ${datCell(c.name||"",      compCols[1],alt(i))}
          ${datCell(c.type||"",      compCols[2],alt(i))}
          ${datCell(c.required||"",  compCols[3],alt(i),true)}
          ${datCell(c.desc||"",      compCols[4],alt(i))}
          ${datCell(c.validation||"",compCols[5],alt(i))}
        </w:tr>`).join("")}
      </w:tbl>`;

      // ── flow table ────────────────────────────────────────────────────
      const flowCols = [600,2000,3200,3560];
      const flowTbl = `<w:tbl>
        <w:tblPr><w:tblW w:w="9360" w:type="dxa"/>${tblBorders}</w:tblPr>
        <w:tblGrid>${flowCols.map(w=>`<w:gridCol w:w="${w}"/>`).join("")}</w:tblGrid>
        <w:tr><w:trPr><w:tblHeader/></w:trPr>
          ${["Bước","Người thực hiện","Hành động","Kết quả / Ghi chú"].map((h,i)=>hdrCell(h,flowCols[i])).join("")}
        </w:tr>
        ${(d.flow||[]).map((f,i)=>`<w:tr>
          ${datCell(f.step||"",  flowCols[0],alt(i),true)}
          ${datCell(f.actor||"", flowCols[1],alt(i))}
          ${datCell(f.action||"",flowCols[2],alt(i))}
          ${datCell(f.result||"",flowCols[3],alt(i))}
        </w:tr>`).join("")}
      </w:tbl>`;

      // ── error table ───────────────────────────────────────────────────
      const errCols = [2800,3200,3360];
      const errTbl = `<w:tbl>
        <w:tblPr><w:tblW w:w="9360" w:type="dxa"/>${tblBorders}</w:tblPr>
        <w:tblGrid>${errCols.map(w=>`<w:gridCol w:w="${w}"/>`).join("")}</w:tblGrid>
        <w:tr><w:trPr><w:tblHeader/></w:trPr>
          ${["Tình huống lỗi","Thông báo hiển thị","Hành động hệ thống"].map((h,i)=>hdrCell(h,errCols[i])).join("")}
        </w:tr>
        ${(d.errors||[]).map((e,i)=>`<w:tr>
          ${datCell(e.situation||"",errCols[0],alt(i))}
          ${datCell(e.message||"",  errCols[1],alt(i))}
          ${datCell(e.action||"",   errCols[2],alt(i))}
        </w:tr>`).join("")}
      </w:tbl>`;

      // ── meta table ────────────────────────────────────────────────────
      const metaRows = [
        ["Tên màn hình", d.funcName],["Mã màn hình", code],["Module", d.module||""],
        ["Loại màn hình", d.screenType||""],["Quyền truy cập", d.accessRoles||""],
        ["Màn hình cha", d.parentScreen||"—"],["Màn hình con", d.childScreens||"—"],
      ];
      const metaTbl = `<w:tbl>
        <w:tblPr><w:tblW w:w="9360" w:type="dxa"/>${tblBorders}</w:tblPr>
        <w:tblGrid><w:gridCol w:w="2200"/><w:gridCol w:w="7160"/></w:tblGrid>
        ${metaRows.map(([k,v])=>`<w:tr>
          ${datCell(k,2200,"D6E4F0")}${datCell(v,7160,"FFFFFF")}
        </w:tr>`).join("")}
      </w:tbl>`;

      // ── open questions table ──────────────────────────────────────────
      const qqCols = [500,5800,1560,1500];
      const qqTbl = `<w:tbl>
        <w:tblPr><w:tblW w:w="9360" w:type="dxa"/>${tblBorders}</w:tblPr>
        <w:tblGrid>${qqCols.map(w=>`<w:gridCol w:w="${w}"/>`).join("")}</w:tblGrid>
        <w:tr><w:trPr><w:tblHeader/></w:trPr>
          ${["#","Nội dung câu hỏi","Người hỏi","Trạng thái"].map((h,i)=>hdrCell(h,qqCols[i])).join("")}
        </w:tr>
        ${(d.openQuestions||["(Chưa có)"]).map((q,i)=>`<w:tr>
          ${datCell(String(i+1),qqCols[0],alt(i),true)}
          ${datCell(q,         qqCols[1],alt(i))}
          ${datCell("BA",      qqCols[2],alt(i))}
          ${datCell("Đang mở", qqCols[3],alt(i))}
        </w:tr>`).join("")}
      </w:tbl>`;

      // ── document.xml body ─────────────────────────────────────────────
      const body = [
        // Cover
        para("TRUNG TÂM THÔNG TIN TÍN DỤNG QUỐC GIA VIỆT NAM (CIC)", {sz:28,bold:true,clr:"1F4E79",center:true,sb:"0",sa:"400"}),
        para("TÀI LIỆU THIẾT KẾ GIAO DIỆN", {sz:36,bold:true,clr:"2E75B6",center:true,sb:"0",sa:"200"}),
        para(d.funcName, {sz:30,bold:true,clr:"1F4E79",center:true,sb:"0",sa:"600"}),
        // Cover info table
        `<w:tbl>
          <w:tblPr><w:tblW w:w="6000" w:type="dxa"/>${tblBorders}
          <w:jc w:val="center"/></w:tblPr>
          <w:tblGrid><w:gridCol w:w="2200"/><w:gridCol w:w="3800"/></w:tblGrid>
          ${[["Mã tài liệu",`CIC-UI-${code}`],["Phiên bản","1.0"],["Ngày tạo",today],["Module",d.module||""],["Trạng thái","Draft"]]
            .map(([k,v])=>`<w:tr>${datCell(k,2200,"D6E4F0")}${datCell(v,3800,"FFFFFF")}</w:tr>`).join("")}
        </w:tbl>`,
        `<w:p><w:r><w:br w:type="page"/></w:r></w:p>`,

        // History
        h1("Lịch sử thay đổi"),
        `<w:tbl>
          <w:tblPr><w:tblW w:w="9360" w:type="dxa"/>${tblBorders}</w:tblPr>
          <w:tblGrid><w:gridCol w:w="800"/><w:gridCol w:w="1200"/><w:gridCol w:w="2800"/><w:gridCol w:w="4560"/></w:tblGrid>
          <w:tr><w:trPr><w:tblHeader/></w:trPr>
            ${["Phiên bản","Ngày","Người thực hiện","Nội dung thay đổi"].map((h,i)=>hdrCell(h,[800,1200,2800,4560][i])).join("")}
          </w:tr>
          <w:tr>${datCell("1.0",800)}${datCell(today,1200)}${datCell("[Tên BA]",2800)}${datCell("Khởi tạo tài liệu",4560)}</w:tr>
        </w:tbl>`,
        `<w:p><w:r><w:br w:type="page"/></w:r></w:p>`,

        // Section 1
        h1("Thông tin chung"),
        h2("Mục đích"),
        para(d.purpose||"", {sz:20}),
        h2("Phạm vi áp dụng"),
        ...(d.scope||[]).map(s=>bullet(s)),
        `<w:p><w:r><w:br w:type="page"/></w:r></w:p>`,

        // Section 2
        h1(d.funcName),
        h2("Tổng quan màn hình"),
        metaTbl, emptyPara(),

        h2("Danh sách thành phần UI"),
        compTbl, emptyPara(),

        h2("Luồng xử lý chính"),
        flowTbl, emptyPara(),

        h2("Xử lý lỗi & thông báo"),
        errTbl, emptyPara(),

        h2("Điều kiện nghiệp vụ đặc biệt"),
        ...(d.businessRules||[]).map(r=>bullet(r)),
        emptyPara(),

        h2("Câu hỏi mở / Ghi chú"),
        qqTbl,
      ].join("\n");

      // ── numbering.xml (for bullets) ───────────────────────────────────
      const numberingXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:numbering xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas"
  xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:abstractNum w:abstractNumId="0">
    <w:lvl w:ilvl="0">
      <w:start w:val="1"/><w:numFmt w:val="bullet"/>
      <w:lvlText w:val="•"/>
      <w:lvlJc w:val="left"/>
      <w:pPr><w:ind w:left="560" w:hanging="280"/></w:pPr>
      <w:rPr><w:rFonts w:ascii="Symbol" w:hAnsi="Symbol"/></w:rPr>
    </w:lvl>
  </w:abstractNum>
  <w:num w:numId="1"><w:abstractNumId w:val="0"/></w:num>
</w:numbering>`;

      // ── styles.xml (minimal heading styles) ───────────────────────────
      const stylesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:docDefaults>
    <w:rPrDefault><w:rPr>
      <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>
      <w:sz w:val="22"/><w:szCs w:val="22"/>
    </w:rPr></w:rPrDefault>
  </w:docDefaults>
  <w:style w:type="paragraph" w:styleId="Normal">
    <w:name w:val="Normal"/>
  </w:style>
</w:styles>`;

      // ── document.xml ──────────────────────────────────────────────────
      const docXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas"
  xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
  xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <w:body>
    ${body}
    <w:sectPr>
      <w:pgSz w:w="11906" w:h="16838"/>
      <w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1417"/>
    </w:sectPr>
  </w:body>
</w:document>`;

      // ── [Content_Types].xml ───────────────────────────────────────────
      const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
  <Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/>
</Types>`;

      // ── _rels/.rels ───────────────────────────────────────────────────
      const rels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

      // ── word/_rels/document.xml.rels ──────────────────────────────────
      const wordRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering" Target="numbering.xml"/>
</Relationships>`;

      // ── Load JSZip từ cdnjs (whitelisted) ──────────────────────────────
      if (!window.JSZip) {
        await new Promise((resolve, reject) => {
          const s = document.createElement("script");
          s.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
          s.onload = resolve;
          s.onerror = reject;
          document.head.appendChild(s);
        });
      }
      const zip = new window.JSZip();

      zip.file("[Content_Types].xml",          contentTypes);
      zip.file("_rels/.rels",                  rels);
      zip.file("word/document.xml",            docXml);
      zip.file("word/styles.xml",              stylesXml);
      zip.file("word/numbering.xml",           numberingXml);
      zip.file("word/_rels/document.xml.rels", wordRels);

      const zipBlob = await zip.generateAsync({type:"blob", mimeType:"application/vnd.openxmlformats-officedocument.wordprocessingml.document"});
      const blob = zipBlob;
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = (code + "_" + d.funcName.replace(/\s+/g,"_").replace(/[^\w_]/g,"") + ".docx");
      a.click();
      URL.revokeObjectURL(url);
      setDocxStatus("done");
      setTimeout(()=>setDocxStatus("idle"),3000);
    } catch(err) {
      console.error("[CIC docx]", err);
      setDocxStatus("error");
      setTimeout(()=>setDocxStatus("idle"),4000);
    }
  }

  const sBg = {idle:"#F1F5F9",loading:C.blueXs,done:"#F0FDF4",error:"#FEF2F2"};
  const sC  = {idle:C.muted,loading:C.blue,done:C.green,error:C.red};
  const INP = {width:"100%",border:`1.5px solid ${C.border}`,borderRadius:7,padding:"9px 12px",fontFamily:"inherit",fontSize:13,color:C.text,background:"#FAFCFF",outline:"none",boxSizing:"border-box"};
  const LBL = {fontSize:11,fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:.5,display:"block",marginBottom:5};

  return (
    <div style={{fontFamily:"'Segoe UI',Arial,sans-serif",background:C.bg,minHeight:"100vh",color:C.text}}>

      {/* Header */}
      <div style={{background:`linear-gradient(135deg,${C.navy},${C.blue})`,padding:"15px 26px",display:"flex",alignItems:"center",gap:13,boxShadow:"0 2px 14px rgba(31,78,121,.3)"}}>
        <div style={{width:34,height:34,background:"white",borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <rect x="3"  y="3"  width="8" height="8" rx="1.5" fill="#1F4E79"/>
            <rect x="13" y="3"  width="8" height="8" rx="1.5" fill="#2E75B6"/>
            <rect x="3"  y="13" width="8" height="8" rx="1.5" fill="#2E75B6"/>
            <rect x="13" y="13" width="8" height="8" rx="1.5" fill="#1F4E79"/>
          </svg>
        </div>
        <div>
          <div style={{fontSize:16,fontWeight:700,color:"white"}}>CIC UI Doc Generator</div>
          <div style={{fontSize:11,color:"rgba(255,255,255,.7)"}}>Sinh tài liệu thiết kế giao diện · Confluence + Word</div>
        </div>
      </div>

      {/* Workspace */}
      <div style={{display:"grid",gridTemplateColumns:"370px 1fr",gap:16,padding:"18px 22px",minHeight:"calc(100vh - 64px)"}}>

        {/* LEFT */}
        <div style={{background:C.surface,borderRadius:10,boxShadow:"0 2px 12px rgba(31,78,121,.10)",display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <div style={{padding:"13px 18px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:9}}>
            <span>📥</span><span style={{fontSize:14,fontWeight:600}}>Thông tin đầu vào</span>
          </div>
          <div style={{padding:"15px 16px",display:"flex",flexDirection:"column",gap:13,overflowY:"auto",flex:1}}>

            <div><label style={LBL}>Tên chức năng *</label>
              <input style={INP} value={funcName} onChange={e=>setFuncName(e.target.value)} placeholder="VD: Màn hình Đăng nhập hệ thống CIC"/>
            </div>
            <div><label style={LBL}>Mã màn hình</label>
              <input style={INP} value={screenCode} onChange={e=>setScreenCode(e.target.value)} placeholder="VD: SCR-AUTH-01"/>
            </div>
            <div><label style={LBL}>Module / Hệ thống</label>
              <input style={INP} value={module} onChange={e=>setModule(e.target.value)} placeholder="VD: Xác thực & Phân quyền"/>
            </div>
            <div><label style={LBL}>Mô tả chức năng</label>
              <textarea style={{...INP,minHeight:88,resize:"vertical"}} value={funcDesc}
                onChange={e=>setFuncDesc(e.target.value)}
                placeholder="Mô tả mục đích, đối tượng người dùng, luồng chính..."/>
            </div>

            {/* Upload */}
            <div>
              <label style={LBL}>Mockup / Wireframe (tùy chọn)</label>
              <div style={{border:`2px dashed ${C.border}`,borderRadius:8,padding:"16px",textAlign:"center",cursor:"pointer",background:C.blueXs}}
                onClick={()=>fileRef.current.click()}
                onDragOver={e=>e.preventDefault()}
                onDrop={e=>{e.preventDefault();handleFiles(e.dataTransfer.files);}}>
                <input ref={fileRef} type="file" accept="image/*" multiple style={{display:"none"}} onChange={e=>handleFiles(e.target.files)}/>
                <div style={{fontSize:24,marginBottom:4}}>🖼️</div>
                <div style={{fontSize:12,fontWeight:600,color:C.blue}}>Kéo thả hoặc click để upload</div>
                <div style={{fontSize:11,color:C.muted,marginTop:2}}>PNG, JPG, WebP · Nhiều ảnh</div>
              </div>
              {images.length > 0 && (
                <div style={{marginTop:8}}>
                  <div style={{fontSize:11,color:"#92400E",background:"#FFF7ED",padding:"6px 10px",borderRadius:6,borderLeft:"3px solid #F59E0B",marginBottom:6}}>
                    ℹ️ {images.length} ảnh đã upload. Tên file dùng để suy luận UI.
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6}}>
                    {images.map((img,i)=>(
                      <div key={i} style={{position:"relative",borderRadius:6,overflow:"hidden",aspectRatio:"4/3",background:C.bg}}>
                        <img src={img.dataUrl} alt={img.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                        <button onClick={()=>setImages(prev=>prev.filter((_,j)=>j!==i))}
                          style={{position:"absolute",top:3,right:3,background:"rgba(0,0,0,.6)",color:"white",border:"none",borderRadius:"50%",width:18,height:18,cursor:"pointer",fontSize:10,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Status */}
            <div style={{padding:"10px 13px",borderRadius:8,fontSize:12,display:"flex",alignItems:"center",gap:8,background:sBg[status.type],color:sC[status.type]}}>
              {status.type==="loading"
                ? <div style={{width:13,height:13,border:"2px solid currentColor",borderTopColor:"transparent",borderRadius:"50%",animation:"spin .7s linear infinite",flexShrink:0}}/>
                : <span>{status.type==="done"?"✓":status.type==="error"?"✕":"⬤"}</span>}
              <span>{status.msg}</span>
            </div>

            <button onClick={generate} disabled={loading}
              style={{background:loading?"#94A3B8":`linear-gradient(135deg,${C.navy},${C.blue})`,color:"white",border:"none",borderRadius:8,padding:"12px 0",fontSize:14,fontWeight:700,cursor:loading?"not-allowed":"pointer",width:"100%"}}>
              {loading?"⏳ Đang sinh tài liệu...":"✨ Sinh tài liệu"}
            </button>
          </div>
        </div>

        {/* RIGHT */}
        <div style={{background:C.surface,borderRadius:10,boxShadow:"0 2px 12px rgba(31,78,121,.10)",display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <div style={{padding:"13px 18px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:9}}>
            <span>📄</span><span style={{fontSize:14,fontWeight:600}}>Kết quả</span>
          </div>
          <div style={{display:"flex",borderBottom:`2px solid ${C.border}`,padding:"0 16px",flexShrink:0}}>
            {[["confluence","🟦 Confluence Markup"],["preview","📋 Xem trước Word"]].map(([id,label])=>(
              <button key={id} onClick={()=>setActiveTab(id)}
                style={{padding:"9px 15px",fontSize:13,fontWeight:600,cursor:"pointer",color:activeTab===id?C.blue:C.muted,border:"none",borderBottom:`2px solid ${activeTab===id?C.blue:"transparent"}`,background:"none",marginBottom:-2,whiteSpace:"nowrap"}}>
                {label}
              </button>
            ))}
          </div>
          <div style={{flex:1,overflow:"auto",padding:16}}>
            {activeTab==="confluence" && (
              confluence
                ? <pre style={{background:"#0F172A",color:"#E2E8F0",padding:16,borderRadius:8,fontSize:12,fontFamily:"Consolas,'Courier New',monospace",whiteSpace:"pre-wrap",wordBreak:"break-word",lineHeight:1.65,margin:0}}>{confluence}</pre>
                : <div style={{textAlign:"center",padding:60,color:C.muted}}><div style={{fontSize:44,marginBottom:12,opacity:.35}}>🟦</div><p style={{fontSize:14}}>Confluence Markup sẽ hiển thị ở đây</p></div>
            )}
            {activeTab==="preview" && <DocPreview d={data}/>}
          </div>
          {data && (
            <div style={{padding:"11px 16px",borderTop:`1px solid ${C.border}`,display:"flex",gap:10,alignItems:"center",flexShrink:0,flexWrap:"wrap"}}>
              <button onClick={copyConfluence}
                style={{background:copied?"#16A34A":"#0052CC",color:"white",border:"none",borderRadius:7,padding:"8px 14px",fontSize:12,fontWeight:600,cursor:"pointer"}}>
                {copied?"✓ Đã copy!":"📋 Copy Confluence Markup"}
              </button>
              <button onClick={downloadDocx} disabled={docxStatus==="building"}
                style={{background:docxStatus==="done"?"#16A34A":docxStatus==="error"?"#EF4444":"#1F4E79",
                  color:"white",border:"none",borderRadius:7,padding:"8px 14px",fontSize:12,fontWeight:600,
                  cursor:docxStatus==="building"?"not-allowed":"pointer"}}>
                {docxStatus==="building"?"⏳ Đang tạo...":docxStatus==="done"?"✓ Đã tải!":docxStatus==="error"?"❌ Lỗi":"⬇️ Tải file .docx"}
              </button>
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} textarea{font-family:inherit}`}</style>
    </div>
  );
}
