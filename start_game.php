<?php
include 'session_start.php';

$words = ["aback", "abase", "abate", "abbey", "abhor",
          "batch", "bathe", "baker", "beach", "beard",
          "cabin", "cable", "cacti", "caddy", "cadet",
          "dance", "dated", "dairy", "daily", "daisy",
          "eager", "eagle", "early", "earth", "easel",
          "fable", "facet", "faded", "fails", "fairy",
          "gable", "gains", "gamer", "gamma", "gamut",
          "habit", "hairy", "halve", "happy", "harry",
          "icily", "icing", "ideal", "idiom", "idiot",
          "jaded", "jails", "jambs", "japan", "jaunt",
          "kebab", "ketch", "keeps", "kelly", "kicks",
          "label", "labor", "laced", "laces", "lacks",
          "macro", "madam", "magic", "magna", "maids",
          "naive", "naked", "named", "names", "nanny",
          "oaken", "oasis", "oaths", "obese", "obeys",
          "packs", "paddy", "pages", "pains", "paint",
          "quake", "quasi", "quays", "queen", "query",
          "rabid", "raced", "racer", "races", "racks",
          "sable", "sacks", "sadly", "safer", "sages",
          "table", "taken", "taker", "tales", "talks",
          "unfit", "unify", "union", "units", "unity"
];

$random_word = $words[array_rand($words)];
$_SESSION['game_state'] = [
    'word' => $random_word,
    'attempts' => 0,
    'max_attempts' => 6,
    'guesses' => []
];

if (!isset($_SESSION['leaderboard'])) {
    $_SESSION['leaderboard'] = [];
}

echo json_encode(['message' => 'New game started', 'game_state' => $_SESSION['game_state'], 'leaderboard' => $_SESSION['leaderboard']]);
?>
