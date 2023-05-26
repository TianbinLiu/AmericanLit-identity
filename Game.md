---
title: Game
layout: default
---

<style>
:root {
  --border-color: #291D4D;
  --dialog-background: #FFF3B4;

  --menu-background: #FFE8D2;
  --menu-border-color: #A48465;
  --menu-font-color: #3A160D;
  --menu-selected-background: #7fc2ff;
}

* {
  box-sizing:border-box;
}

body {
  background: #333;
  padding: 0;
  margin: 0;
  overflow: hidden;
}

.game-container {
  position: relative; 
  width: 352px;
  height: 198px;
  margin: 0 auto;
  outline: 1px solid #fff;

  transform: scale(3) translateY(50%);
}

.game-container canvas {
  image-rendering: pixelated;
}

.TextMessage {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 36px;
  padding: 4px;
  background: var(--menu-background);
  border-top: 1px solid var(--menu-border-color);
  color: var(--menu-font-color);
}
.TextMessage_p {
  margin: 0;
  font-size: 12px;
}
.TextMessage_button {
  margin: 0;
  font-size: 8px;  
  padding:0;
  -webkit-appearance: none;
  background:none;
  border:0;
  font-family: inherit;
  cursor: pointer;

  position: absolute;
  right: 2px;
  bottom: 0;
}
</style>

<html>
<body>
<div class="game-container">
    <canvas class="game-canvas" width="352" height="198"></canvas>
</div>
</body>

<script src="{{ '/assets/js/utils.js' | relative_url }}" type="text/javascript"></script>
<script src="{{ '/assets/js/inputHandler.js' | relative_url }}" type="text/javascript"></script>
<script src="{{ '/assets/js/Overworld.js' | relative_url }}" type="text/javascript"></script>
<script src="{{ '/assets/js/GameObject.js' | relative_url }}" type="text/javascript"></script>
<script src="{{ '/assets/js/Person.js' | relative_url }}" type="text/javascript"></script>
<script src="{{ '/assets/js/Sprite.js' | relative_url }}" type="text/javascript"></script>
<script src="{{ '/assets/js/OverworldMap.js' | relative_url }}" type="text/javascript"></script>
<script src="{{ '/assets/js/OverworldEvent.js' | relative_url }}" type="text/javascript"></script>
<script src="{{ '/assets/js/TextMessage.js' | relative_url }}" type="text/javascript"></script>
<script src="{{ '/assets/js/KeyPressListener.js' | relative_url }}" type="text/javascript"></script>
<script src="{{ '/assets/js/init.js' | relative_url }}" type="text/javascript"></script>
</html>