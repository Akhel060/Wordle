<?php
include 'session_start.php';

if (!isset($_SESSION['game_state'])) {
    echo json_encode(['error' => 'No game in progress']);
    exit;
}

$guess = isset($_POST['guess']) ? strtolower(trim($_POST['guess'])) : '';
$word = $_SESSION['game_state']['word'];

if (strlen($guess) !== 5) {
    echo json_encode(['error' => 'Guess must be 5 letters']);
    exit;
}

$_SESSION['game_state']['attempts']++;
$_SESSION['game_state']['guesses'][] = $guess;

$correct = $guess === $word;
$letters = str_split($guess);
$response = [];

foreach ($letters as $index => $letter) {
    if ($letter === $word[$index]) {
        $response[] = 'correct';
    } elseif (strpos($word, $letter) !== false) {
        $response[] = 'present';
    } else {
        $response[] = 'absent';
    }
}

if ($_SESSION['game_state']['attempts'] >= $_SESSION['game_state']['max_attempts'] || $correct) {
    $message = $correct ? 'Congratulations, you guessed the word!' : 'Game over! The word was ' . $word;
    if (!isset($_SESSION['leaderboard'])) {
        $_SESSION['leaderboard'] = [];
    }
    $_SESSION['leaderboard'][] = [
        'attempts' => $_SESSION['game_state']['attempts'],
        'guessed' => $correct
    ];
    usort($_SESSION['leaderboard'], function ($a, $b) {
        return $a['attempts'] - $b['attempts'];
    });
    $_SESSION['leaderboard'] = array_slice($_SESSION['leaderboard'], 0, 10);
    unset($_SESSION['game_state']);
} else {
    $message = 'Keep guessing!';
}

echo json_encode(['guess' => $guess, 'response' => $response, 'message' => $message, 'game_state' => $_SESSION['game_state'] ?? null, 'leaderboard' => $_SESSION['leaderboard']]);
?>
