// 選取容器
const timetableGrid = document.getElementById('timetable-grid');

// 定義時間段和星期
const times = ['Y', 'Z', '1', '2', '3', '4', 'N', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D'];
let days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
// 生成課表標題列
let headerRow = document.createElement('div');
headerRow.classList.add('row');
headerRow.innerHTML = `<div class=""></div>`; // 空白的第一格
days.forEach(day => {
    headerRow.innerHTML += `<div class="header">${day}</div>`;
});
timetableGrid.appendChild(headerRow);

// 生成時間段和對應的空白單元格
times.forEach(time => {
    let row = document.createElement('div');
    row.classList.add('row');

    // 時間段
    row.innerHTML = `<div class="time-cell">${time}</div>`;

    // 每天的空白課表單元格
    for (let i = 0; i < days.length; i++) {
        row.innerHTML += `<div class="day-cell" id=${days[i]}${time}></div>`;
    }

    // 將行添加到課表中
    timetableGrid.appendChild(row);
});

const toggleBtns = document.querySelectorAll('.right-btn');
const sidebars = document.querySelectorAll('.sidebar');
let activeIndex = null;
// Toggle sidebar visibility
toggleBtns.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        // 確保所有按鈕與側邊欄狀態正確
        if(index === activeIndex){
            closeAllSidebars();
            activeIndex = null;
        }
        else{
            toggleBtns.forEach((_, otherIndex) => {
                if (index === otherIndex) {
                    sidebars[otherIndex].classList.add('active');
                    sidebars[otherIndex].classList.add('open');
                    toggleBtns[otherIndex].classList.add('open');
                    toggleBtns[otherIndex].classList.add('active');
                } 
                else {
                    sidebars[otherIndex].classList.remove('active');
                    sidebars[otherIndex].classList.add('open');
                    toggleBtns[otherIndex].classList.add('open');
                    toggleBtns[otherIndex].classList.remove('active');
                }
            });
            activeIndex = index;
        }
    });
});

document.addEventListener('click', (event) => {
    if (!event.target.classList.contains('right-btn') && 
        !event.target.closest('.sidebar') && 
        !event.target.closest('#overlay') &&
        !event.target.classList.contains('float_course')) {
        closeAllSidebars();
        activeIndex = null; // 重置狀態
    }
});

sidebars.forEach(sidebar => {
    sidebar.addEventListener('click', (event) => {
        event.stopPropagation(); // 防止事件冒泡到 document
    });
});

function closeAllSidebars() {
    sidebars.forEach(sidebar => sidebar.classList.remove('open'));
    toggleBtns.forEach(btn => btn.classList.remove('open'));
}

const options = document.getElementById("options");
const backBtn = document.getElementById("back-btn");
const restartBtn = document.getElementById("restart-btn");
const btnGrid = document.getElementById("back-rst-btn-grid");
const searchInput = document.getElementById("search-container");

const initoptions = ["學士班課程", "研究所課程", "學士班共同課程", "其他課程", "學分學程", "跨域學程", "教育學程"];
const optionsData = {
    "學士班課程": ["一般學士班", "學士後專班"],
    "學士班課程/一般學士班": ["校級", "醫學院", "牙醫學院", "護理學院", "藥物科學院", "生物醫學暨工程學院", "生命科學院", 
                  "電機學院", "國防教育與研究總中心", "博雅書苑", "資訊學院", "工學院", "理學院", "管理學院",
                  "工程生物科學學院", "人文藝術與社會學院", "客家文化學院", "跨院學程"],
    "學士班課程/一般學士班/校級": ["(學士班大一大二不分系)"],
    "學士班課程/一般學士班/醫學院": ["(醫學系)", "CMD(中醫學系)"],
    "學士班課程/一般學士班/牙醫學院": ["(牙醫學系)"],
    "學士班課程/一般學士班/護理學院": ["(護理學系)"],
    "學士班課程/一般學士班/藥物科學院": ["(藥物科學院)", "(藥學系)"],
    "學士班課程/一般學士班/生物醫學暨工程學院": ["(生物醫學影像暨放射科學系)", "(物理治療暨輔助科技學系)", "(數位醫療學士學位學程)", "(醫學生物技術暨檢驗學系)", "BME(生物醫學工程學系)"],
    "學士班課程/一般學士班/生命科學院": ["(生命科學系暨基因體科學研究所)"],
    "學士班課程/一般學士班/電機學院": ["CEE(電機系共同課程)", "DCE(電機學院院級(學士班))", "DEO(光電工程學系)", "DMC(半導體工程學系)", "UEE(電機工程學系)"],
    "學士班課程/一般學士班/國防教育與研究總中心": ["SET(系統工程與科技學士學位學程)"], 
    "學士班課程/一般學士班/博雅書苑": ["DWA(百川學士學位學程)"], 
    "學士班課程/一般學士班/資訊學院": ["CS(資訊學院共同課程)", "DCP(資訊工程學系)"], 
    "學士班課程/一般學士班/工學院": ["DCV(土木工程學系)", "DMA(材料科學與工程學系)", "DME(機械工程學系)"], 
    "學士班課程/一般學士班/理學院": ["DAC(應用化學系)", "DAM(應用數學系)", "DEP(電子物理學系)", "DPS(理學院科學學士學位學程)"], 
    "學士班課程/一般學士班/管理學院": ["DEM(工業工程與管理學系)", "DIF(資訊管理與財務金融系)", "DMS(管理科學系)", "DOM(管理學院院本部)", "DOM(管理學院共同課程)", "DTM(運輸與物流管理學系)"],
    "學士班課程/一般學士班/工程生物科學學院": ["DBT(生物科技學系)"], 
    "學士班課程/一般學士班/人文藝術與社會學院": ["CHASS(人文藝術與社會學院)", "DFL(外國語文學系)"], 
    "學士班課程/一般學士班/客家文化學院": ["DCT(傳播與科技學系)", "DHS(人文社會學系)"], 
    "學士班課程/一般學士班/跨院學程": ["EPPS(學士後電子與光子學士學位學程)"],
    "學士班課程/學士後專班": ["跨院學程"],
    "學士班課程/學士後專班/跨院學程": ["EPPS(學士後電子與光子學士學位學程)"],
    "研究所課程": ["一般研究所", "EMBA", "在職專班", "產業專班", "碩(博)士學位學程"],
    "研究所課程/一般研究所": ["校級", "醫學院", "牙醫學院", "護理學院", "藥物科學院", "生物醫學暨工程學院", "生命科學院", "電機學院", 
                            "光電學院", "科技法律學院", "國際半導體產業學院", "智慧科學暨綠能學院", "產學創新研究學院", "資訊學院",
                            "工學院", "理學院", "管理學院", "工程生物科學學院", "人文藝術與社會學院", "客家文化學院"],
    "研究所課程/一般研究所/校級": ["(跨專業長期照顧與管理碩士學位學程)[碩]"], 
    "研究所課程/一般研究所/醫學院": ["(生理學研究所)[博]"], 
    "研究所課程/一般研究所/牙醫學院": ["(牙醫學系)[博]", "(牙醫學系)[碩]", "(口腔生物研究所)[博]", "(口腔生物研究所)[碩]", "ITM(口腔組織工程暨生技材料研究所)[碩]"], 
    "研究所課程/一般研究所/護理學院": ["(社區健康照護研究所)[碩]", "(護理學系)[博]", "(臨床護理研究所)[博]", "(臨床護理研究所)[碩]"], 
    "研究所課程/一般研究所/藥物科學院": ["(生物藥學研究所)[博]", "(生物藥學研究所)[碩]", "(食品安全及健康風險評估研究所)[碩]", "(藥學系)[碩]"], 
    "研究所課程/一般研究所/生物醫學暨工程學院": ["(生物醫學影像暨放射科學系)[博]", "(生物醫學影像暨放射科學系)[碩]", "(生物醫學工程學系)[博]", "(生物醫學工程學系)[碩]", 
                                            "(生醫光電研究所)[博]", "(生醫光電研究所)[碩]", "(物理治療暨輔助科技學系)[博]", "(物理治療暨輔助科技學系)[碩]", 
                                            "(醫學生物技術暨檢驗學系)[博]", "(醫學生物技術暨檢驗學系)[碩]"], 
    "研究所課程/一般研究所/生命科學院": ["(生化暨分子生物研究所)[博]", "(生化暨分子生物研究所)[碩]", "(生命科學系暨基因體科學研究所)[博]", "(生命科學系暨基因體科學研究所)[碩]", 
                                      "(神經科學研究所)[博]", "(神經科學研究所)[碩]", "(微生物及免疫學研究所)[博]", "(微生物及免疫學研究所)[碩]", "CLS(生命科學院)[碩]"], 
    "研究所課程/一般研究所/電機學院": ["ECM(電信工程研究所)[博]", "ECM(電信工程研究所)[碩]", "GEE(電機工程學系)[博]", "GEE(電機工程學系)[碩]", "ICE(電機學院院級(研究所))[碩]", 
                                    "ICN(電控工程研究所)[博]", "ICN(電控工程研究所)[碩]", "IEE(電子研究所)[碩]", "IEO(光電工程學系)[博]", "IEO(光電工程學系)[碩]", "IIE(生醫工程研究所)[碩]"],
    "研究所課程/一般研究所/光電學院": ["COP(光電學院博士班)[博]", "IIB(影像與生醫光電研究所)[碩]", "ILP(照明與能源光電研究所)[碩]", "IPO(光電學院)[碩]", "IPS(光電系統研究所)[碩]"], 
    "研究所課程/一般研究所/科技法律學院": ["ITL(科技法律研究所)[博]", "ITL(科技法律研究所)[碩]"], 
    "研究所課程/一般研究所/國際半導體產業學院": ["CST(國際半導體產業學院博士班)[博]", "CST(國際半導體產業學院碩士班)[碩]", "NIMP(國際半導體越南境外專班)[碩]"], 
    "研究所課程/一般研究所/智慧科學暨綠能學院": ["AIX(智慧計算與科技研究所)[碩]", "AIY(智慧系統與應用研究所)[碩]", "AIZ(智慧與綠能產學研究所)[碩]", "DPCAI(智慧科學暨綠能學院博士班)[博]", "IOG(智慧科學暨綠能學院)[碩]"], 
    "研究所課程/一般研究所/產學創新研究學院": ["AI System(智能系統研究所)[博]", "AI System(智能系統研究所)[碩]", "PSEMI(前瞻半導體研究所)[博]", "Pio-SEMI(前瞻半導體研究所)[碩]"], 
    "研究所課程/一般研究所/資訊學院": ["GPC(資訊學院博士班)[博]", "ICC(國際資訊碩士班)[碩]", "ICS(資訊安全研究所)[碩]", "IDS(數據科學與工程研究所碩士班)[碩]", "ILE(多媒體工程研究所)[碩]",
                                     "IOC(資訊科學與工程研究所)[博]", "IOC(資訊科學與工程研究所)[碩]", "IOE(網路工程研究所)[碩]"],
    "研究所課程/一般研究所/工學院": ["ICV(土木工程學系)[碩]", "IEV(環境工程研究所)[碩]", "IMA(材料科學與工程學系)[博]", "IMA(材料科學與工程學系)[碩]", "IME(機械工程學系)[碩]",
                                   "INT(材料科學與工程學系奈米科技碩博班)[碩]", "SSE(太空系統工程研究所)[碩]"], 
    "研究所課程/一般研究所/理學院": ["IAC(應用化學系)[博]", "IAC(應用化學系)[碩]", "IAM(應用數學系)[碩]", "IEP(電子物理學系)[博]", "IEP(電子物理學系)[碩]", "IMM(應用數學系數學建模與科學計算碩士班)[碩]",
                                  "IMO(應用化學系分子科學碩博班)[博]", "IMO(應用化學系分子科學碩博班)[碩]", "IOP(物理研究所)[碩]", "IST(統計學研究所)[碩]"], 
    "研究所課程/一般研究所/管理學院": ["GMBA(企業管理碩士學位學程)[碩]", "IBM(經營管理研究所)[碩]", "IEM(工業工程與管理學系)[博]", "IEM(工業工程與管理學系)[碩]", "IIM(資訊管理研究所)[博]", "IIM(資訊管理研究所)[碩]", 
                                    "IMS(管理科學系)[博]", "IMS(管理科學系)[碩]", "IOF(資訊管理與財務金融系財務金融博士班)[博]", "IOF(資訊管理與財務金融系財務金融碩博士班)[碩]"], 
    "研究所課程/一般研究所/工程生物科學學院": ["DBSE(工程生物科學學院產業博士班)[博]", "IBE(分子醫學與生物工程研究所)[博]", "IBE(分子醫學與生物工程研究所)[碩]", "IBI(生物資訊及系統生物研究所)[博]",
                                            "IBI(生物資訊及系統生物研究所)[碩]", "IBT(生物科技學系)[博]", "IBT(生物科技學系)[碩]"], 
    "研究所課程/一般研究所/人文藝術與社會學院": ["IAA(應用藝術研究所)[博]", "IAA(應用藝術研究所)[碩]", "IAR(建築研究所)[碩]", "ICS(社會與文化研究所)[碩]", "ICT(傳播研究所)[碩]", "IED(教育研究所)[碩]", 
                                              "ILC(外國語文學系外國文學與語言學碩士班)[碩]", "IMU(音樂研究所)[碩]", "IPMC(心智哲學研究所)[碩]", "ITE(英語教學研究所)[碩]", "IVS(視覺文化研究所)[碩]", "STS(科技與社會研究所)[碩]"], 
    "研究所課程/一般研究所/客家文化學院": ["ICH(傳播與科技學系)[碩]", "IHP(客家文化學院博士班)[博]", "INA(人文社會學系族群與文化碩士班)[碩]"],
    "研究所課程/EMBA": ["管理學院"],
    "研究所課程/EMBA/管理學院": ["IBA(高階主管管理碩士學程)[碩]"],
    "研究所課程/在職專班": ["醫學院", "護理學院", "生命科學院", "電機學院", "光電學院", "科技法律學院", "資訊學院", "工學院", "理學院", "管理學院", "客家文化學院"],
    "研究所課程/在職專班/醫學院": ["(醫務管理研究所)[碩]", "(臨床醫學研究所)[碩]"], 
    "研究所課程/在職專班/護理學院": ["(護理學系)[碩]"], 
    "研究所課程/在職專班/生命科學院": ["(生技醫療經營管理碩士在職學位學程)[碩]"], 
    "研究所課程/在職專班/電機學院": ["IEC(電機學院碩士在職專班)[碩]"], 
    "研究所課程/在職專班/光電學院": ["DPPS(光電系統研究所碩士在職專班)[碩]"], 
    "研究所課程/在職專班/科技法律學院": ["ITL(科技法律研究所碩士在職專班)[碩]"], 
    "研究所課程/在職專班/資訊學院": ["ICTCI(資訊學院科技犯罪偵查資通訊碩士在職專班)[碩]", "IPC(資訊學院碩士在職專班)[碩]", "PCM(國防資安管理碩士在職專班)[碩]"], 
    "研究所課程/在職專班/工學院": ["IAP(工學院碩士在職專班-精密組)[碩]", "IMI(工學院碩士在職專班-工程管理組)[碩]", "ISE(工學院碩士在職專班-半導體組)[碩]", "ISR(工學院碩士在職專班-產安組)[碩]"], 
    "研究所課程/在職專班/理學院": ["IAT(理學院碩士在職專班-應用科技組)[碩]", "INE(理學院碩士在職專班-科技與數位學習組)[碩]"], 
    "研究所課程/在職專班/管理學院": ["IBM(管理學院碩士在職專班-經管組)[碩]", "IEM(管理學院碩士在職專班-工管組)[碩]", "IIM(管理學院碩士在職專班-資管組)[碩]", "IMS(管理學院碩士在職專班-管科組)[碩]", "IOF(管理學院碩士在職專班-財金組)[碩]", 
                                   "IOM(管理學院專班(共同課程))[碩]", "ITM(管理學院碩士在職專班-科管組)[碩]", "ITT(管理學院碩士在職專班-物流組)[碩]"], 
    "研究所課程/在職專班/客家文化學院": ["IHC(客家社會與文化碩士在職專班)[碩]"],
    "研究所課程/產業專班": ["智慧科學暨綠能學院", "工程生物科學學院"],
    "研究所課程/產業專班/智慧科學暨綠能學院": ["AIIT(智慧計算與科技研究所智慧物聯網產業碩士專班)[碩]"],
    "研究所課程/產業專班/工程生物科學學院": ["MECB(工程與計算生醫產業碩士專班)[碩]"],
    "研究所課程/碩(博)士學位學程": ["醫學院", "藥物科學院", "生物醫學暨工程學院", "生命科學院", "電機學院", "資訊學院", "工學院", "理學院", "工程生物科學學院", "人文藝術與社會學院"],
    "研究所課程/碩(博)士學位學程/醫學院": ["IHP(國際衛生碩士學位學程)[碩]", "MPH(公共衛生碩士學位學程)[碩]", "PIM(跨領域醫學博士學位學程)[博]", "SHMP(智慧醫療與政策管理產業博士學位學程)[博]", 
                                        "TM(轉譯醫學博士學位學程)[博]", "UST-EST(環境科技博士學位學程(台灣聯合大學系統))[博]"], 
    "研究所課程/碩(博)士學位學程/藥物科學院": ["PRSP(醫藥品法規科學博士學位學程)[博]"], 
    "研究所課程/碩(博)士學位學程/生物醫學暨工程學院": ["生物醫學暨工程學院", "IPPP(光電博士學位學程(台灣聯合大學系統))[博]"], 
    "研究所課程/碩(博)士學位學程/生命科學院": ["生命科學院", "BIP(生技醫療產業博士學位學程)[博]", "IBN(跨領域神經科學博士學位學程(生命科學院)(台灣聯合大學系統))[博]", "IMPMM(跨領域分子醫學碩士學位學程)[碩]", 
                                            "MMP(分子醫學博士學位學程)[博]", "TIGP-INS(跨領域神經科學國際研究生博士學位學程)[博]"], 
    "研究所課程/碩(博)士學位學程/電機學院": ["AIG(人工智慧技術與應用碩士學位學程)[碩]", "ECS(電機資訊國際博士學位學程)[博]", "ECS(電機資訊國際碩士學位學程)[碩]", "IPP(光電博士學位學程)[博]"], 
    "研究所課程/碩(博)士學位學程/資訊學院": ["GDP(資通安全碩士學位學程)[碩]", "INS(網路與資訊系統博士學位學程)[博]"], 
    "研究所課程/碩(博)士學位學程/工學院": ["ROB(機器人碩士學位學程)[碩]"], 
    "研究所課程/碩(博)士學位學程/理學院": ["ISC(永續化學科技國際研究生博士學位學程)[博]"], 
    "研究所課程/碩(博)士學位學程/工程生物科學學院": ["IBN(跨領域神經科學博士學位學程)[博]", "IBS(生醫科學與工程博士學位學程)[博]"], 
    "研究所課程/碩(博)士學位學程/人文藝術與社會學院": ["IACS(亞際文化研究國際碩士學位學程(台灣聯合大學系統))[碩]", "IAS(亞際文化研究國際碩士學位學程（台灣聯合大學系統）)[碩]"],
    "學士班共同課程": ["校共同課程", "院共同課程"],
    "學士班共同課程/校共同課程": ["通識", "外語", "體育", "物理", "微積分", "服務學習", "核心課程", "語言與溝通", "化學", "生物學"], 
    "學士班共同課程/院共同課程": ["資訊學院共同課程", "電機學院與資訊學院共同課程", "電機系共同課程", "管理學院共同課程"],
    "其他課程": ["台中一中科學班", "寫作中心", "教學發展中心", "華語中心", "資訊技術服務中心", "創創工坊", "生物資訊學程", "博雅書苑", "混合實境微學程", "軍訓", "藝文賞析", "社永中心"], 
    "學分學程": ["AI聯盟學分學程(研究所)", "AI聯盟學分學程(學士班)", "IMBA國際管理學分學程", "人工智慧視覺技術學分學程", "人工智慧探索應用學分學程", "人工智慧工業應用學分學程", "人工智慧自然語言技術學分學程", 
                "健康長壽學分學程", "創新科技藝術學分學程", "外文系:華語教學學分學程", "太空科技與工程學分學程", "微菌轉譯研究學分學程", "心理學學分學程", "智慧財產權學分學程", "法律學分學程", "生物科技管理學程", 
                "生醫產業經營與法律學分學程", "管理學院:管理基礎學分學程", "系統與決策最優化學分學程", "美國法學分學程", "語言學與人工智能學分學程", "音樂學分學程"], 
    "跨域學程": ["人工智慧跨域學程-工程與科學組", "護理學系智慧健康照護跨域學程", "心理學跨域學程", "運輸與物流管理學系跨域學程(B)外系學生", "材料科學與工程學系跨域學程(A)本系學生", "說故事與多媒體跨域學程", 
                "人工智慧跨域學程-管理組", "人機智能與哲學跨域學程", "生物科技學系-生物資訊工程跨域學程", "傳播與科技學系跨域學程(B)外系學生", "電機工程學系-資訊工程跨域學程", "物理研究所跨域學程(B)外系學生", 
                "人文社會學院跨領域設計與創新科技跨域學程", "生物資訊及系統生物研究所跨域學程(B)外系學生", "醫學系智慧健康照護跨域學程", "電機工程學系跨域學程(B)外系學生", "外國語文學系跨域學程(B)外系學生", 
                "生物科技學系跨域學程(B)外系學生(生物科技)", "應用數學學系跨域學程(B)外系學生", "資訊工程學系-生物資訊工程跨域學程", "資訊工程學系-電機工程跨域學程", "管理學院創業與創新管理跨域學程", 
                "管理科學系跨域學程(B)外系學生", "資訊工程學系金融科技跨域學程", "科技法律學院跨域學程", "醫療器材跨域學程", "人文社會學院藝術與音樂跨域學程", "土木工程學系跨域學程(B)外系學生", 
                "應用化學學系跨域學程(B)外系學生", "人工智慧跨域學程-生醫組", "資訊工程學系跨域學程(B)外系學生", "資訊工程學系智慧健康照護跨域學程", "工業工程與管理學系跨域學程(B)外系學生", 
                "生物科技學系跨域學程(B)外系學生(分子醫學)", "資訊管理與財務金融學系跨域學程(B)外系學生", "科技法律學院智慧財產權法跨域學程", "科技管理研究所跨域學程(B)外系學生", "材料科學與工程學系跨域學程(B)外系學生", 
                "資訊管理與財務金融學系金融科技跨域學程", "教育研究所學習科學跨域學程", "三一學程(光電、材料、電物)"]
};

let historyStack = []; // 用來追蹤歷史
const lectures = document.getElementById("lectures");
// 更新選項
const updateOptions = (newOptions, parentPath = "") => {
    options.innerHTML = "";
    newOptions.forEach((option, index) => {
        const fullPath = parentPath ? `${parentPath}/${option}` : option; // 維持完整路徑
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.setAttribute('data-content', fullPath); // 將完整路徑存入 data-content
        btn.textContent = option;
        btn.style.animationDelay = `${index * 0.1}s`; // 延遲動畫
        options.appendChild(btn);
    });

    // 綁定事件到按鈕
    const optionButtons = document.querySelectorAll('.option-btn');
    optionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const selectedOption = button.getAttribute('data-content'); // 取得完整路徑
            const childOptions = optionsData[selectedOption] || []; // 根據名稱查找子選項
            if (childOptions.length > 0) {
                historyStack.push({ options: newOptions, path: parentPath }); // 紀錄當前層級的選項與路徑
                updateOptions(childOptions, selectedOption); // 使用完整路徑進行更新
                btnGrid.style.display = "grid";
                searchInput.style.display = "none";
            }
            else{
                //把selectedOption傳入php
                let day_l = "MTWRFSU";
                let time_l = "yz1234n56789abcd";
                let time_str = "";
                for (let i = 0; i < days.length; i++){
                    for (let j = 0; j < times.length; j++){
                        if(is_select[i][j]){
                            time_str += day_l[i] + time_l[j];
                        }
                    }
                }
                console.log(time_str);
                let append_str = selectedOption + '@' + time_str;

                sidebars[0].classList.remove('active');
                sidebars[1].classList.add('active');
                toggleBtns[0].classList.remove('active');
                toggleBtns[1].classList.add('active');
                activeIndex = 1;

                fetch('search.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: 'data=' + encodeURIComponent(append_str)
                })
                .then(response => response.json())
                .then(result => {
                    printOption(result);
                })
                .catch(error => {
                    console.error("Error:", error);
                });
            }
        });
    });
};

let selected_course = new Map();

document.addEventListener("DOMContentLoaded", function() {
    fetch('get_from_database.php')
    .then(response => response.json())
    .then(result => {
        selected_course.clear();
        result.forEach(element => {
            selected_course.set(element.cos_id, element);
            add_course(element);
        });
        printSelect(selected_course);
    })
    .catch(error => {
        console.error("Error:", error);
    });
});

function show_pop(course){
    const lecture_info = JSON.parse(course.getAttribute('data-content'));
    console.log(lecture_info);
    document.getElementById("overlay").style.display = "flex";
    let popup_body = document.getElementById("popup");
    popup_body.innerHTML = "<span id='close' onclick='close_popup()'>X</span>";
    popup_body.innerHTML += "<div class='popup_body'>課程名稱：" + lecture_info.cos_name 
        + `&nbsp;<span class='brief' onclick='brief_pop(${lecture_info.cos_id})'>課程綱要</span><br>`
        + "課程代號：" + lecture_info.cos_id + "<br>"
        + "摘要：" + lecture_info.brief + "<br>"
        + "開課教師：" + lecture_info.teacher + "<br>"
        + "開課時間：" + lecture_info.cos_time + "<br>"
        + "人數上限：" + lecture_info.num_limit + "<br>"
        + "修課別：" + lecture_info.cos_type + "<br>"
        + "修課時數：" + lecture_info.cos_hours + "<br>"
        + "學分數：" + lecture_info.cos_credit + "<br>"
        + "備註：" + lecture_info.memo + "<br>"
        + "</div>"
    if(selected_course.has(lecture_info.cos_id)){
        popup_body.innerHTML += 
            `<div class='popup_footer'>
                <button class="rmv" onclick='remove_course(${JSON.stringify(lecture_info)}); remove_from_database(${JSON.stringify(lecture_info)})'>
                    移出課表
                </button>
            </div>`;
    }
    else{
        popup_body.innerHTML +=
            `<div class='popup_footer'>
                <button class="add" onclick='add_course(${JSON.stringify(lecture_info)}); add_to_database(${JSON.stringify(lecture_info)})'>
                    加入課表
                </button>
            </div>`;
    }
        
}
function brief_pop(cos_id){
    window.open(`https://timetable.nycu.edu.tw/?r=main/crsoutline&Acy=113&Sem=2&CrsNo=${cos_id}&lang=zh-tw`, '_blank');
}

function add_course(cos_info){
    selected_course.set(cos_info.cos_id, cos_info);
    printSelect(selected_course);
    close_popup();
    const pattern = /([MTWRFSU])([yz1234n56789abcd]+)-?/g;
    let matches = new Set();
    let match;
    while ((match = pattern.exec(cos_info.cos_time)) !== null) {
        const dayCode = match[1];        // 星期代碼
        const number = match[2];          // 時間段數字
        // 將星期代碼轉換為縮寫
        const dayIndex = "MTWRFSU".indexOf(dayCode);
        const day = days[dayIndex];
    
        // 將時間段代碼轉換為對應的數字
        for(let i = 0; i < number.length; i++){
            let timeIndex  = "yz1234n56789abcd".indexOf(number[i]);
            let timeNumber = times[timeIndex]
            matches.add(`${day}${timeNumber}`);
        }
    }
    console.log(cos_info);
    matches.forEach(match => {
        const elements = document.querySelectorAll(`.cosT${match}`);
        const count = elements.length;
        const base = document.getElementById(match);
        const cell = document.createElement('span');
        cell.classList.add(`cosT${match}`);
        cell.classList.add(`cos_id_${cos_info.cos_id}`);
        cell.classList.add('float_course');
        cell.setAttribute('data-content', JSON.stringify(cos_info));
        cell.style.bottom = `${0+count*12}%`;
        cell.style.left = `${0+count*7}%`;
        // if (count % 2 === 1){
        //     cell.style.backgroundColor = 'rgb(99, 70, 179)';
        // }else
        //     cell.style.backgroundColor = 'rgb(64, 168, 171)';
        cell.onmouseenter = function() {
            mouse_enter(cos_info.cos_id);
        };
        cell.onmouseleave = function() {
            mouse_leave(cos_info.cos_id);
        };
        cell.onclick = function() {
            show_pop(this);
        }
        let lines = cos_info.cos_name.split('\n');
        let name = lines[0];
        if(name.length > 10){
            name = lines[0].substring(0,10) + "...";
        }
        cell.textContent = name;
        base.appendChild(cell);
    });
}

function add_to_database(cos_info){
    console.log("cos_info: ", JSON.stringify(cos_info));
    fetch('add_to_database.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cos_info)
    })
    .then(response => response.text())
    .then(result => {
        console.log(result);
    })
    .catch(error => {
        console.error("Error:", error);
    });
}

function remove_from_database(cos_info){
    console.log("cos_info: ", JSON.stringify(cos_info));
    fetch('remove_from_database.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cos_info)
    })
    .then(response => response.text())
    .then(result => {
        console.log(result);
    })
    .catch(error => {
        console.error("Error:", error);
    });
}

function logout(){
    document.cookie = "student_id" + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "login_index.php";
}

function remove_course(cos_info){
    selected_course.delete(cos_info.cos_id);
    document.querySelectorAll(`.cos_id_${cos_info.cos_id}`).forEach(cell =>{
        cell.remove();
    })

    const pattern = /([MTWRFSU])([yz1234n56789abcd]+)-?/g;
    let matches = new Set();
    let match;
    while ((match = pattern.exec(cos_info.cos_time)) !== null) {
        const dayCode = match[1];        // 星期代碼
        const number = match[2];          // 時間段數字
        const dayIndex = "MTWRFSU".indexOf(dayCode);
        const day = days[dayIndex];
    
        // 將時間段代碼轉換為對應的數字
        for(let i = 0; i < number.length; i++){
            let timeIndex  = "yz1234n56789abcd".indexOf(number[i]);
            let timeNumber = times[timeIndex]
            matches.add(`${day}${timeNumber}`);
        }
    }
    matches.forEach(match => {
        const elements = document.querySelectorAll(`.cosT${match}`);
        let i = 0;
        elements.forEach(element =>{
            element.style.bottom = `${0+i*12}%`;
            element.style.left = `${0+i*7}%`;
            // if (i % 2 === 1){
            //     element.style.backgroundColor = 'rgb(99, 70, 179)';
            // }else
            //     element.style.backgroundColor = 'rgb(64, 168, 171)';
            i = i + 1;
        })
    })
    printSelect(selected_course);
    close_popup();
}

function mouse_enter(cos_id){
    document.querySelectorAll(`.cos_id_${cos_id}`).forEach(cell =>{
        cell.classList.add('hover');
    })
}

function mouse_leave(cos_id){
    document.querySelectorAll(`.cos_id_${cos_id}`).forEach(cell =>{
        cell.classList.remove('hover');
    })
}

function close_popup(){
    document.getElementById("overlay").style.display = "none";
}

function confirmSearch(){
    const keyword = document.querySelector("#search-input").value;
    if (keyword == "")
        return;
    sidebars[0].classList.remove('active');
    sidebars[1].classList.add('active');
    toggleBtns[0].classList.remove('active');
    toggleBtns[1].classList.add('active');
    activeIndex = 1;
    fetch('keyword.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'data=' + encodeURIComponent(keyword)
    })
    .then(response => response.json())
    .then(result => {
        printOption(result);
    })
    .catch(error => {
        console.error("Error:", error);
    });
}

function printOption(result){
    lectures.innerHTML = "";
    result.forEach(r => {
        let lecture = document.createElement('div');
        lecture.className = 'lecture-btn';
        lecture.onclick = function() {
            show_pop(this);
        };
        lecture.setAttribute('data-content', JSON.stringify(r));
        const lecture_name = document.createElement('p');
        lecture_name.className = 'first_line';
        var lines = r.cos_name.split('\n');
        lecture_name.textContent = r.cos_id + " " + lines[0];
        lecture.appendChild(lecture_name);
        const lecture_time = document.createElement('div');   
        lecture_time.className = 'second_line'; 
        lecture_time.textContent = r.cos_time;
        const lecture_type = document.createElement('span');
        lecture_type.className = 'cos_type';
        if(r.cos_type == "必修"){
            lecture_type.classList.add('green');
        }
        if(r.cos_type == "選修"){
            lecture_type.classList.add('blue');
        }
        lecture_type.textContent = r.cos_type;
        lecture_time.appendChild(lecture_type);
        lecture.appendChild(lecture_time);
        const teacher = document.createElement('p');
        teacher.className = 'third_line';
        teacher.textContent = r.teacher + " · " + r.cos_credit + "學分";
        lecture.appendChild(teacher);
        lectures.appendChild(lecture);
        
    })
    console.log(result);
}

const selects = document.getElementById('selects');
function printSelect(result){
    selects.innerHTML = "";
    result.forEach((r, _) => {
        let lecture = document.createElement('div');
        lecture.className = 'lecture-btn';
        lecture.onclick = function() {
            show_pop(this);
        };
        lecture.setAttribute('data-content', JSON.stringify(r));
        const lecture_name = document.createElement('p');
        lecture_name.className = 'first_line';
        var lines = r.cos_name.split('\n');
        lecture_name.textContent = r.cos_id + " " + lines[0];
        lecture.appendChild(lecture_name);
        const lecture_time = document.createElement('div');   
        lecture_time.className = 'second_line'; 
        lecture_time.textContent = r.cos_time;
        const lecture_type = document.createElement('span');
        lecture_type.className = 'cos_type';
        if(r.cos_type == "必修"){
            lecture_type.classList.add('green');
        }
        if(r.cos_type == "選修"){
            lecture_type.classList.add('blue');
        }
        lecture_type.textContent = r.cos_type;
        lecture_time.appendChild(lecture_type);
        lecture.appendChild(lecture_time);
        const teacher = document.createElement('p');
        teacher.className = 'third_line';
        teacher.textContent = r.teacher + " · " + r.cos_credit + "學分";
        lecture.appendChild(teacher);
        selects.appendChild(lecture);
    })
    console.log(result);
}

const timeblocks = document.querySelectorAll('.day-cell');
let isFilter = false;
function timeFilter(){
    if(!isFilter){
        isFilter = true;
        timeblocks.forEach(block => {
            block.innerHTML = "";
            block.style.cursor = "pointer";
            block.onclick = function(){
                set_filter(block);
            }
        });
    }
    else{
        isFilter = false;
        for (let i = 0; i < days.length; i++){
            for (let j = 0; j < times.length; j++){
                is_select[i][j] = false;
            }
        }
        timeblocks.forEach(block => {
            block.innerHTML = "";
            block.classList.remove('selected');
            block.style.cursor = "default";
            block.onclick = null;
        });
        selected_course.forEach(course => {
            add_course(course);
        });

    }
    
}

let is_select = new Array(days.length);
for (let i = 0; i < days.length; i++) {
    is_select[i] = new Array(times.length);
}
for (let i = 0; i < days.length; i++){
    for (let j = 0; j < times.length; j++){
        is_select[i][j] = false;
    }
}
function set_filter(block){
    if(!block.classList.contains("selected")){
        block.classList.add('selected');
        let d = block.id.substring(0,3);
        let t = block.id.substring(3,4);
        is_select[days.indexOf(d)][times.indexOf(t)] = true;
        const gif = document.createElement("img");
        gif.src = "img/check.gif?" + new Date().getTime(); // 確保每次載入新 GIF
        gif.alt = "Animation";
        gif.onclick = function(){
            remove_filter(block);
        }
        gif.onload = function () {
            setTimeout(() => {
                gif.src = "img/check.png";
            }, 3000);
        };

        block.appendChild(gif);
    }
}
function remove_filter(block){
    const existingGif = block.querySelector("img");
    let d = block.id.substring(0,3);
    let t = block.id.substring(3,4);
    is_select[days.indexOf(d)][times.indexOf(t)] = false;
    if (existingGif) {
        existingGif.remove();
    }
    setTimeout(() => {
        block.classList.remove('selected');
    }, 500);
    
}

// 回上一頁功能
backBtn.addEventListener('click', () => {
    if (historyStack.length > 0) {
        const { options: previousOptions, path: parentPath } = historyStack.pop(); // 取出上一層的選項與路徑
        updateOptions(previousOptions, parentPath);

        // 如果已經是最初的選項，隱藏回上一頁按鈕
        if (historyStack.length === 0) {
            btnGrid.style.display = "none";
            searchInput.style.display = "flex";
        }
    }
});

// 重置功能
restartBtn.addEventListener('click', () => {
    updateOptions(initoptions);
    historyStack = [];
    btnGrid.style.display = "none";
    searchInput.style.display = "flex";
});

updateOptions(initoptions);