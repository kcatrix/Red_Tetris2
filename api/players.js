class Players {
	constructor(name, leader, higherPos, ingame, id) {
		this.name = name
		this.leader = leader
		this.higherPos = higherPos
		this.ingame = ingame
		this.id = id
	}

	setHigherPos( number ) {
		this.higherPos = number;
	}

	setLeader() {
		this.leader = 1;
	}

	setIngame(status){
		this.ingame = status
	}

}

module.exports = Players;
