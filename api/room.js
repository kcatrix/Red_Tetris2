const { url } = require('inspector');
const Players = require('./players');

class Room {
	constructor(name){
		this.name = name;
		this.Players = [new Players(name, true)];
		this.token = this.generateToken();
		this.Url = this.generateUrl();
	}
	
	creatNewPlayer(name){
		this.Players.push(new Players(name, false))
	}

	generateToken() {
		// Génère un nombre entier aléatoire entre 0 et 999
		const randomNumber = Math.floor(Math.random() * 1000);
		// Formate le nombre pour qu'il ait toujours 3 chiffres
		return randomNumber.toString().padStart(3, '0');
	}

	generateUrl() {
		const Url = '/' + this.token + '/' + this.name;
		return Url;

	}

	// Ajouter logique d'ajout et de suppression des utilisateurs lorsqu'ils quittent la socket 
	// Ajouter suppression de la room lorsque plus de player et ainsi dire au front qui est le gagnant
}

module.exports = Room;