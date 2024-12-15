<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Timetable</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div id="overlay">
        <div id="popup">
            <span id="close">X</span>
        </div>
    </div>

    <div id="sidebar-container">
        <div class="right-btn active" id="toggle-btn1">1</div>
        <div class="sidebar" id="sidebar1">
            <div id="search-container">
                <input type="text" id="search-input" placeholder="輸入課程關鍵字or課號">
                <img src="img/search.png" onclick="confirmSearch()" id="search-btn">
            </div>
            <div id="back-rst-btn-grid" style="display: none;">
                <img src="img/back.png" alt="Back" class="back-rst-btn" id="back-btn">
                <img src="img/home.png" alt="Restart" class="back-rst-btn" id="restart-btn">
            </div>
            <div class="options" id="options"></div> 
        </div>

        <div class="right-btn" id="toggle-btn2">2</div>
        <div class="sidebar" id="sidebar2">
            <div class="lectures" id="lectures"></div> 
        </div>

        <div class="right-btn" id="toggle-btn3">3</div>
        <div class="sidebar" id="sidebar3">
            <div class="selects" id="selects"></div> 
        </div>
    </div>
    <div id="timetable-container">
        <h1>Timetable</h1>
        <div id="timetable-grid">
            <!-- 動態生成的課表將插入這裡 -->
        </div>
    </div>

    <script src="script.js"></script>

    <?php
    if (isset($_POST['search'])) {
        include('search_course.php');

        $results = search_course();
    }
    ?>
</body>
</html>
