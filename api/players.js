class Players {
	constructor(name, leader, higherPos) {
		this.name = name
		this.leader = leader
		this.higherPos = higherPos
	}

	setHigherPos( number ) {
		this.higherPos = number;
	}

	setLeader() {
		this.leader = 1;
	}

}

module.exports = Players;
