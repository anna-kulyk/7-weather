/**
 * Containes information about location: name, coordinates and timezone. 
 */
class LocationData {
    #id;
    #name;
    #coordinates = {};
    #timezone;

    constructor(id, name, coordinates, timezone) {
        this.#id = id
        this.#name = name;
        this.#coordinates = coordinates;
        this.#timezone = timezone;
    }

    get id() {
        return this.#id;
    }

    get name() {
        return this.#name;
    }

    get coordinates() {
        return this.#coordinates;
    }

    get timezone() {
        return this.#timezone;
    }

}