<?php
require_once 'db.php';


$keyword = $_POST['data']; // 從前端接收到的搜尋關鍵字"袁賢";

// 查詢各個表格
$queries = [
    "SELECT * FROM course_info_1 WHERE cos_name LIKE '%$keyword%' OR cos_id LIKE '%$keyword%' OR teacher LIKE '%$keyword%'",
    "SELECT * FROM course_info_2 WHERE cos_name LIKE '%$keyword%' OR cos_id LIKE '%$keyword%' OR teacher LIKE '%$keyword%'",
    "SELECT * FROM course_info_3 WHERE cos_name LIKE '%$keyword%' OR cos_id LIKE '%$keyword%' OR teacher LIKE '%$keyword%'",
    "SELECT * FROM course_info_4 WHERE cos_name LIKE '%$keyword%' OR cos_id LIKE '%$keyword%' OR teacher LIKE '%$keyword%'",
    "SELECT * FROM course_info_5 WHERE cos_name LIKE '%$keyword%' OR cos_id LIKE '%$keyword%' OR teacher LIKE '%$keyword%'",
    "SELECT * FROM course_info_6 WHERE cos_name LIKE '%$keyword%' OR cos_id LIKE '%$keyword%' OR teacher LIKE '%$keyword%'",
    "SELECT * FROM course_info_7 WHERE cos_name LIKE '%$keyword%' OR cos_id LIKE '%$keyword%' OR teacher LIKE '%$keyword%'"
];

$results = [];
foreach ($queries as $query) {
    $result = $conn->query($query);
    if ($result) {
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                $results[] = $row;
            }
        }
    } else {
        echo "Error in query: " . $conn->error;
    }
}

// 去除重複的 cos_id
$uniqueResults = [];
$seen = [];
foreach ($results as $result) {
    if (!isset($seen[$result['cos_id']])) {
        $uniqueResults[] = $result;
        $seen[$result['cos_id']] = true;
    }
}

$conn->close();
echo json_encode($uniqueResults);

?>