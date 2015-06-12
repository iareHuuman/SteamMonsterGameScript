// Compiled and costomized by reddit user /u/therusher
// Credit to reddit users /u/kolodz and /u/leandr0c for additional code

// Custom variables
var debug = false;
var clicksPerSecond = 100;
var autoClickerVariance = Math.floor(clicksPerSecond / 10);
var respawnCheckFreq = 5000;
var targetSwapperFreq = 1000;

// You shouldn't need to ever change this, you only push to server every 1s anyway
var autoClickerFreq = 1000;

// variables to store the setIntervals
var autoRespawner, autoClicker, autoTargetSwapper;

// ================ STARTER FUNCTIONS ================
function startAutoClicker() {
	if(autoClicker) {
		console.log("Autoclicker is already running!");
		return;
	}

	autoClicker = setInterval( function(){
		//Vary the number of clicks by up to the autoClickerVariance variable (plus or minus)
		var randomVariance = Math.floor(Math.random() * autoClickerVariance * 2) - (autoClickerVariance);
		var clicks = clicksPerSecond + randomVariance;
		
		//Set the variable to be sent to the server
		g_Minigame.m_CurrentScene.m_nClicks = clicks;

		if(debug)
			console.log('clicking ' + clicks + ' times this second.');
	}, autoClickerFreq);

	console.log("autoClicker has been started.");
}

function startAutoRespawner() {
	if(autoRespawner) {
		console.log("autoRespawner is already running!");
		return;
	}
	
	autoRespawner = setInterval( function(){
		if(debug)
			console.log('Checking if the player is dead.');

		
		// Credit to /u/kolodz for base code. http://www.reddit.com/r/SteamMonsterGame/comments/39joz2/javascript_auto_respawn/
		if(g_Minigame.m_CurrentScene.m_bIsDead) {
			if(debug)
				console.log('Player is dead. Respawning.');

			RespawnPlayer();
		}
	}, respawnCheckFreq);
	
	console.log("autoRespawner has been started.");
}

function startAutoTargetSwapper() {
	if(autoTargetSwapper) {
		console.log("autoTargetSwapper is already running!");
		return;
	}

	// Credit to /u/leandr0c for base code. http://www.reddit.com/r/SteamMonsterGame/comments/39l1wx/javascript_autosmart_clicker_respawner/
	autoTargetSwapper = setInterval(function() {
        var isBoss =! 1,
            isSpawner =!1,
            lSpawner =-1,
            lMinion =-1,
            target =null;
        g_Minigame.m_CurrentScene.m_rgEnemies.each(function(mob){
            isBoss || (2 == mob.m_data.type ? 
                (isBoss =! 0, target = mob) : lSpawner > 0 && 0 == mob.m_data.type && mob.m_data.hp < lSpawner ? 
                    (lSpawner = mob.m_data.hp, target = mob) : 0 > lSpawner && 0 == mob.m_data.type ? 
                        (lSpawner = mob.m_data.hp, isSpawner =! 0, target = mob) : lMinion > 0 && !isSpawner && mob.m_data.hp < lMinion ?
                            (lMinion = mob.m_data.hp, target = mob) : 0 > lMinion && !isSpawner && (lMinion = mob.m_data.hp, target = mob)
            )
        });
        g_Minigame.m_CurrentScene.m_rgPlayerData.current_lane != target.m_nLane && g_Minigame.CurrentScene().TryChangeLane(target.m_nLane);
        g_Minigame.CurrentScene().TryChangeTarget(target.m_nID);
	}, targetSwapperFreq);
	
	console.log("autoTargetSwapper has been started.");
}

function startAllAutos() {
	startAutoClicker();
	startAutoRespawner();
	startAutoTargetSwapper();
}

// ================ STOPPER FUNCTIONS ================
function stopAutoClicker() {
	if(autoClicker) {
		clearInterval(autoClicker);
		autoClicker = null;
		console.log("autoClicker has been stopped.");
	}
	else
		console.log("No autoClicker is running to stop.");
}
function stopAutoRespawner() {
	if(autoRespawner) {
		clearInterval(autoRespawner);
		autoRespawner = null;
		console.log("autoRespawner has been stopped.");
	}
	else
		console.log("No autoRespawner is running to stop.");
		
}
function stopAutoTargetSwapper() {
	if(autoTargetSwapper){
		clearInterval(autoTargetSwapper);
		autoTargetSwapper = null;
		console.log("autoTargetSwapper has been stopped.");
	}
	else
		console.log("No autoTargetSwapper is running to stop.");
}

function stopAllAutos() {
	stopAutoClicker();
	stopAutoRespawner();
	stopAutoTargetSwapper();
}

//Start all autos
startAllAutos();