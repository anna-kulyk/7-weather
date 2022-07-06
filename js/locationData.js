/**
 * Containes information about location: name, coordinates and timezone. 
 */
class LocationData {
    #name;
    #coordinates = {};
    #timezone;

    constructor(name, coordinates, timezone) {
        this.#name = name;
        this.#coordinates = coordinates;
        this.#timezone = timezone;
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