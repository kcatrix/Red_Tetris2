class Players {
	constructor(name, leader, higherPos, socketId) {
		this.name = name
		this.leader = leader
		this.higherPos = higherPos
		this.socketId = socketId;
	}

	setHigherPos( number ) {
		this.higherPos = number;
	}

	setLeader() {
		this.leader = 1;
	}

}

module.exports = Players;
