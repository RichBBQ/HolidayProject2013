function ArrowPositionCalculator() {
    this.POSITIVE_DIR = 1;
    this.NEGATIVE_DIR = -1;
    this.currentDirection = 1;

    this.smallestPosition = -1;
    this.biggestPosition = 99;

    this.currentPosition = 0;
    this.speed = 12;

    this.reset = function() {
        this.currentPosition = 0;
    }

    this.changeSpeed = function(newSpeed) {
        this.speed = newSpeed;
    }

    this.updatePosition = function() {
        var delta = this.speed * this.currentDirection;
        this.currentPosition = this.currentPosition + delta;

        // Go LEFT if too far RIGHT
        if (this.currentPosition > this.biggestPosition) {
            this.currentDirection = this.NEGATIVE_DIR;
            var wrappedPosition = this.biggestPosition - (this.currentPosition - this.biggestPosition);
            this.currentPosition = wrappedPosition;
        }

        // Go RIGHT if too far LEFT
        if (this.currentPosition < this.smallestPosition) {
            this.currentDirection = this.POSITIVE_DIR;
            var wrappedPosition = this.smallestPosition + (this.smallestPosition - this.currentPosition);
            this.currentPosition = wrappedPosition;
        }
    }

    this.getPosition = function() {
        return this.currentPosition;
    }

    /**
     * On a scale of 0 to 100.
     */
    this.getAdjustedPosition = function() {
        return this.currentPosition + 1;
    }
}