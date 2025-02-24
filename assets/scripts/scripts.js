function searchTable() {
    const input = document.getElementById("searchInput").value.toLowerCase().trim();
    const keywords = input.split(/\s+/);
    const tables = document.querySelectorAll(".table-container");
    let hasGlobalMatch = false;

    tables.forEach(table => {
        let hasMatch = false;

        const headers = table.querySelectorAll("thead th");
        headers.forEach(header => {
            const text = header.innerText.toLowerCase();
            if (keywords.every(keyword => text.includes(keyword))) {
                hasMatch = true;
                hasGlobalMatch = true;
            }
        });

        const rows = table.querySelectorAll("tbody tr");
        rows.forEach(row => {
            const rowText = row.innerText.toLowerCase();
            if (keywords.every(keyword => rowText.includes(keyword))) {
                row.style.display = "";
                hasMatch = true;
                hasGlobalMatch = true;
            } else {
                row.style.display = "none";
            }
        });

        if (hasMatch) {
            table.style.display = "";
        } else {
            table.style.display = "none";
        }
    });

    if (!hasGlobalMatch) {
        alert("ไม่พบผลลัพธ์การค้นหา");
    }
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
            const description = item.description || "-";
            const descriptionThai = item.description_thai || "";
            const shortcutHtml = item.shortcut?.map(s => {
                if (s.class) {
                    return `<span class="${s.class}">${s.key}</span>`;
                } else {
                    return `<span>&nbsp;${s.key}&nbsp;</span>`;
                }
            }).join(' ') || "-";

            row.innerHTML = `<td><span class="description-style">${description}</span><br>${descriptionThai}</td><td>${shortcutHtml}</td>`;
        }

        tableBody.appendChild(row);
    });
}

// เรียกใช้งานฟังก์ชันโหลดข้อมูลเมื่อหน้าเว็บโหลดเสร็จ
document.addEventListener('DOMContentLoaded', loadShortcuts);

// ฟังก์ชันยุบ/ขยายตารางทั้งหมด
function toggleAllTables() {
    const allTableBodies = document.querySelectorAll('.table-custom tbody');
    let isCollapsed = false;

    // ตรวจสอบว่าตารางทั้งหมดถูกซ่อนอยู่หรือไม่
    allTableBodies.forEach(tbody => {
        if (tbody.style.display !== 'none') {
            isCollapsed = true;
        }
    });

    // ยุบ/ขยายตารางทั้งหมด
    allTableBodies.forEach(tbody => {
        if (isCollapsed) {
            tbody.style.display = 'none'; // ซ่อนตารางทั้งหมด
        } else {
            tbody.style.display = ''; // แสดงตารางทั้งหมด
        }
    });
}

// ฟังก์ชันยุบ/ขยายตารางเดียว
function toggleTable(tableId) {
    const table = document.getElementById(tableId);
    table.style.display = table.style.display === 'none' ? '' : 'none';
}