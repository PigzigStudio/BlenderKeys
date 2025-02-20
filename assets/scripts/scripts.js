// ✅ ฟังก์ชันค้นหา
function searchTable() {
    const input = document.getElementById("searchInput").value.toLowerCase();
    const tables = document.querySelectorAll(".table-container");

    tables.forEach(table => {
        let hasMatch = false;

        // ค้นหาใน Header
        const headers = table.querySelectorAll("thead th");
        headers.forEach(header => {
            if (header.innerText.toLowerCase().includes(input)) {
                hasMatch = true;
            }
        });

        // ค้นหาในแถวข้อมูล
        const rows = table.querySelectorAll("tbody tr");
        rows.forEach(row => {
            if (row.innerText.toLowerCase().includes(input)) {
                row.style.display = "";
                hasMatch = true;
            } else {
                row.style.display = "none";
            }
        });

        // แสดงตารางถ้าพบผลลัพธ์การค้นหาในแถวข้อมูล
        if (hasMatch) {
            table.style.display = "";
            // แสดงทุกแถวในตารางถ้า Header ตรงกับคำค้นหา
            if (headers.length > 0 && headers[0].innerText.toLowerCase().includes(input)) {
                rows.forEach(row => {
                    row.style.display = "";
                });
            }
        } else {
            table.style.display = "none";
        }
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
            const shortcutHtml = item.shortcut?.map(s => {
                if (s.class) {
                    return `<span class="${s.class}">${s.key}</span>`;
                } else {
                    return `<span>&nbsp;${s.key}&nbsp;</span>`; // เพิ่มเว้นวรรค
                }
            }).join(' ') || "-";
            
            row.innerHTML = `<td><span class="description-style">${item.description}</span><br>${item.description_thai || ""}</td><td>${shortcutHtml}</td>`;
        }

        tableBody.appendChild(row);
    });
}

// เรียกใช้งานฟังก์ชันโหลดข้อมูลเมื่อหน้าเว็บโหลดเสร็จ
document.addEventListener('DOMContentLoaded', loadShortcuts);

function toggleTable(tableId) {
    const table = document.getElementById(tableId);
    table.style.display = table.style.display === 'none' ? '' : 'none';
}
