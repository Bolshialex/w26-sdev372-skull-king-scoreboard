# Project Overview
- Name: Skull King ScoreBoard
- Solves: This app to create automation for rounds and score tracking. Allows users
to see a live preview of their current standing within friends. Tracks personal
stats.
- Target Users: Anybody who plays Skull King
# Feature Breakdown
- MVP Features: User interface with user creation and game creation with the
ability to add other players. Keeping track of rounds and scoring.
- Extended feature: Stat analysis for each user. Keeping track of success rates and
overall record while playing the game.
# Data Model Planning
- Main Data Objects:
- Player info
- Player stats
- Game info
- Round info
- Key Relationships: Players will link to games and stats, games will link to
rounds
# User Experience
- User Flows: Users will accomplish the main task of finishing the game by
inserting round information as the game goes along to find a winner after the
specified amount of rounds.
- WireFrames

# Sprint 2 Features to add
- Verification for player creation -> send back to playercard on success
- Clickable player -> takes to player page showing stats
- Edit and delete player - Do not delete player, update isActive in database to false
- Player lookup search/filter