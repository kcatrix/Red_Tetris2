class Players {
	constructor(name, leader, higherPos, ingame, id, scores) {
		this.name = name
		this.leader = leader
		this.higherPos = higherPos
		this.ingame = ingame
		this.id = id
		this.scores = scores
	}

	setScore ( number ) {
		if (number > this.scores || this.scores == undefined)
			this.scores = number;
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
