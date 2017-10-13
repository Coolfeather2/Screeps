# Rewrite underway

## Things that need to be managed 
1. Defend
    - Protect creeps working in non-owned rooms from invaders?
2. Gather
    - Container Mining + Carrying (RCL 2+)
		* one set for each source id (_.map(Game.spawns.Spawn1.room.find(FIND_SOURCES), 'id');)
    - Remote Harvest (RCL 2+) [use flags on source to specify where I want and how many]
    - Backup Harvest (RCL 1+)
    - Mineral Mining? (RCL 6+)
3. Work
	- Fill (from storage to spawn -> extensions -> turrets)
    - Repair (object -> road -> walls + ramparts)
    - Build (turret -> containers -> expansion -> anyMy -> any)
    - Remote Build (turret -> containers -> expansion -> anyMy -> any) [Use flags for source and destination room for building.]
4. Upgrade
5. Attack
Use flags for source and destination room for the attack.
	- Depleat Turret
	- Go to Spawn, Destroying everything blocking path
	- Destroy Spawn

## Energy Flow
Energy Source -> Harvest/Container -> Storage -> Work

## Spawning


## Stats Rework maybe?
Modify the agent to collect from both sources and prefix the servername and add a selector to the panel, just like User and Room
