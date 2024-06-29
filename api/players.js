class Players {
	constructor(name, leader, higherPos, ingame) {
		this.name = name
		this.leader = leader
		this.higherPos = higherPos
		this.ingame = ingame
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
