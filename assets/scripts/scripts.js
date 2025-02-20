// ✅ ฟังก์ชันค้นหา
function searchTable() {
    let input = document.getElementById("searchInput").value.toLowerCase();
    let tables = document.querySelectorAll(".table-container");

    tables.forEach(table => {
        let hasMatch = false;
        let rows = table.querySelectorAll("tbody tr");

        rows.forEach(row => {
            let text = row.innerText.toLowerCase();
            row.style.display = text.includes(input) ? "" : "none";
            if (text.includes(input)) hasMatch = true;
        });

        // ✅ แสดงตารางหากพบผลลัพธ์
        table.style.display = hasMatch ? "" : "none";
    });
}

// ✅ ฟังก์ชันโหลดข้อมูลจาก JSON
async function loadShortcuts() {
    try {
        const response = await fetch('assets/json/shortcuts.json');
        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        const categories = [
            "Selection", "Transform", "Modeling", "Cutting", "Navigation",
            "General", "Relations", "Camera", "Rendering", "UI",
            "Bool-Tool", "Nodes", "Node Wrangler", "Compositing",
            "UV Editor", "Animation General", "Animation Timeline",
            "Graph Editor", "Drivers", "Nonlinear"
        ];

        categories.forEach(category => fillTable(data[category], `${category}-body`));

    } catch (error) {
        console.error('Error loading shortcuts:', error);
    }
}

// ✅ ฟังก์ชันเติมข้อมูลลงในตาราง
function fillTable(data, tableBodyId) {
    const tableBody = document.getElementById(tableBodyId);
    if (!tableBody) return;

    data.forEach(item => {
        const row = document.createElement("tr");

        // ✅ ใช้ `header_class` ถ้ามี
        if (item.header) {
            const headerClass = item.header_class || "section-header"; // ถ้าไม่มีใช้ค่าเริ่มต้น
            row.innerHTML = `<th colspan="2" class="${headerClass}">${item.header}</th>`;
        } else {
            // ✅ ตรวจสอบว่ามี shortcut หรือไม่
            const shortcutHtml = item.shortcut && Array.isArray(item.shortcut)
                ? item.shortcut.map(s => `<span class="${s.class}">${s.key}</span>`).join(" ")
                : "-"; // ถ้าไม่มี shortcut ให้แสดง "-"

            row.innerHTML = `
                <td>${item.description}<br>${item.description_thai || ""}</td>
                <td>${shortcutHtml}</td>
            `;
        }

        tableBody.appendChild(row);
    });
}


// ✅ โหลดข้อมูลเมื่อหน้าเว็บโหลดเสร็จ
window.onload = loadShortcuts;
