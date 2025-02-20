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

// ✅ ฟังก์ชันโหลดข้อมูลจาก JSON และเติมข้อมูลลงในตาราง
async function loadShortcuts() {
    try {
        const response = await fetch('assets/json/shortcuts.json');
        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        console.log('Loaded data:', data); // แสดงข้อมูลในคอนโซล

        const categories = [
            "Selection", "Transform", "Modeling", "Cutting", "Navigation",
            "General", "Relations", "Camera", "Rendering", "UI",
            "Bool-Tool", "Nodes", "Node Wrangler", "Compositing",
            "UV Editor", "Animation General", "Animation Timeline",
            "Graph Editor", "Drivers", "Nonlinear"
        ];

        categories.forEach(category => {
            const tableBody = document.getElementById(`${category}-body`);
            if (tableBody) {
                const categoryData = data[category];
                if (categoryData) {
                    fillTable(categoryData, tableBody);
                } else {
                    console.warn(`Category "${category}" not found in JSON data.`);
                }
            } else {
                console.warn(`Table body with ID "${category}-body" not found.`);
            }
        });

    } catch (error) {
        console.error('Error loading shortcuts:', error);
    }
}

// ✅ ฟังก์ชันเติมข้อมูลลงในตาราง
function fillTable(data, tableBody) {
    data.forEach(item => {
        const row = document.createElement("tr");

        if (item.header) {
            row.innerHTML = `<th colspan="2" class="${item.header_class || "section-header"}">${item.header}</th>`;
        } else {
            const shortcutHtml = item.shortcut?.map(s => `<span class="${s.class}">${s.key}</span>`).join(" ") || "-";
            row.innerHTML = `<td><span class="description-style">${item.description}</span><br>${item.description_thai || ""}</td><td>${shortcutHtml}</td>`;
        }

        tableBody.appendChild(row);
    });
}

// เรียกใช้งานฟังก์ชันโหลดข้อมูลเมื่อหน้าเว็บโหลดเสร็จ
document.addEventListener('DOMContentLoaded', loadShortcuts);
