/** Force garbage collection */
declare function gc() : void;

/** Handle that identifies an active timeout */
declare type timeout_handle = any;
/** Execute a function after a timeout in milliseconds. Additional arguments are passed through to the function. */
declare function setTimeout(fn: (...args: any[]) => void, timeout : number, ...args: any[]): timeout_handle;
/** Cancel a timeout if it has not been executed yet */
declare function clearTimeout(handle: timeout_handle): void;
/**
 *  Cancel all timeouts that have not been executed yet.
 * Warning: Using this function can lead to complex bugs when used in a script. Prefer to cancel single timeouts using clearTimeout instead.
*/
declare function clearAllTimeouts() : void;

/** Handle that identifies an active interval */
declare type interval_handle = any;
/** Execute a function repeatedly after a fixed delay in milliseconds. Additional arguments are passed through to the function. */
declare function setInterval(fn: (...args: any[]) => void, delay : number, ...args: any[]) : interval_handle;
/** Cancel an active interval */
declare function clearInterval(handle: interval_handle) : void;
/**
 *  Cancel all active intervals.
 * Warning: Using this function can lead to complex bugs when used in a script. Prefer to cancel single intervals using clearInterval instead.
*/
declare function clearAllIntervals() : void;

declare class Process {
	/** Execute a function in the next tick. The current tick in milliseconds is passed as argument to the function. */
	nextTick(fn : (milliseconds: number) => void): void;
	/** Clear all functions that would execute in the next tick */
	clearTicks(): void;
	/** Execute all functions for the next tick immediately */
	flushTicks(): void;
}
declare var process : Process;

declare module '@tabletop-playground/api' {
	/** The object type used in {@link GameObject.getObjectType} and {@link GameObject.setObjectType}*/
	enum ObjectType {Regular=0, Ground, Penetrable}

	/** Represent for a single callback function. Use the add() method or the assignment operator = to set the function to call. */
	class Delegate<T> {
		/** Set the function to call. When called multiple times, only the final added function will be called. */
		add(fn: T): void;
		/** Remove the given function from the callback. Doesn't do anything if the function is not set as callback. */
		remove(fn : T): void;
		/** Clear the callback so no function will get called. */
		clear(): void;
	}

	/** Represent one or more callback functions. Use the assignment operator = to set a single function to call, or the add() method to add multiple functions. */
	class MulticastDelegate<T> {
		/** Add a function to call. When called multiple times, all added function will be called. */
		add(fn: T): void;
		/** Remove the given function from the callback. Doesn't do anything if the function is not set as callback. */
		remove(fn: T): void;
		/** Clear the callback so no function will get called. */
		clear(): void;
	}

	/**
	* A color represented by RGB components. The range for each component is from 0 to 1.
	*/
	class Color implements Iterable<number> { 
		/**
		* Make a color from individual color components (RGB space)
		* @param {number} r - Red component
		* @param {number} g - Green component
		* @param {number} b - Blue component
		* @param {number} a - Alpha component
		*/
		constructor(r: number, g: number, b: number, a: number);
		
		/**
		* Red component
		*/
		r: number;
		/**
		* Green component
		*/
		g: number;
		/**
		* Blue component
		*/
		b: number;
		/**
		* Alpha value
		*/
		a: number;
		
		/**
		* Index for red component
		*/
		[0]: number;
		/**
		* Index for green component
		*/
		[1]: number;
		/**
		* Index for blue component
		*/
		[2]: number;
		/**
		* Index for alpha value
		*/
		[3]: number;
		
		[Symbol.iterator](): Iterator<number>;
		
		/**
		* Return a copy of this color
		*/
		clone() : Color;
		/**
		* Convert to a string in the form '(R=,G=,B=,A=)'
		*/
		toString(): string;
		/**
		* Convert to a vector, with x=r y=g z=b
		*/
		toVector(): Vector;
		/**
		* Multiply element-wise (f*r, f*g, f*b, f*a)
		*/
		multiply(f: number): Color;
		/**
		* Smoothly interpolate towards a varying target color
		* @param {Color} current - Current color
		* @param {Color} target - Target color
		* @param {number} deltaTime - Time since last tick
		* @param {number} interpSpeed - Interpolation speed          
		*/
		static interpolateTo(current: Color, target: Color, deltaTime: number, interpSpeed: number): Color;
		/**
		* Linearly interpolate between a and b based on alpha 
		* @param {Color} a - First color
		* @param {Color} b - Second color
		* @param {number} alpha - Result is 100% of a when alpha=0 and 100% of b when alpha=1
		*/
		static lerp(a: Color, b: Color, alpha: number): Color;
	}
	
	/**
	* An orthogonal rotation in 3d space
	*/
	class Rotator implements Iterable<number> {
		/**
		* Make a rotator {Roll, Pitch, Yaw} from rotation values
		* @param {number} roll - Rotation around X axis in degrees
		* @param {number} pitch - Rotation around Y axis in degrees
		* @param {number} yaw - Rotation around Z axis in degrees
		*/
		constructor(roll: number, pitch: number, yaw: number);
		
		/**
		* Pitch (degrees) around Y axis
		*/
		pitch: number;
		/**
		* Yaw (degrees) around Z axis
		*/
		yaw: number;
		/**
		* Roll (degrees) around X axis
		*/
		roll: number;
		
		/**
		* Index for pitch
		*/
		[0]: number;
		/**
		* Index for yaw
		*/
		[1]: number;
		/**
		* Index for roll
		*/
		[2]: number;
		
		[Symbol.iterator](): Iterator<number>;
		
		/**
		* Return a copy of this Rotator
		*/
		clone() : Rotator;
		/**
		* Convert to a string in the form 'P= Y= R='
		*/
		toString(): string;
		/**
		* Combine 2 rotations to give the resulting rotation of first applying this rotator, then b
		*/
		compose(b: Rotator): Rotator;
		/**
		* Get the X direction vector after this rotation
		*/
		toVector(): Vector;
		/**
		* Return true if this rotator is equal to rotator b (a == b) within a specified error tolerance
		* @param {Rotator} b - Rotator to compare to
		* @param {number} errorTolerance - Maximum total difference
		*/
		equals(b: Rotator, errorTolerance: number): boolean;
		/**
		* Return world forward vector rotated by this rotation
		*/
		getForwardVector(): Vector;
		/**
		* Return world right vector rotated by this rotation
		*/
		getRightVector(): Vector;
		/**
		* Return world up vector rotated by this rotation
		*/
		getUpVector(): Vector;
		/**
		* Return rotator representing this rotation scaled by b
		* @param {number} b - Factor to multiply with
		*/
		multiply(b: number): Rotator;
		/**
		* Return negated rotator
		*/
		negate(): Rotator;
		/**
		* Return a vector rotated by this rotation
		*/
		rotateVector(v: Vector): Vector;
		/**
		* Return a vector rotated by the inverse of this rotation
		*/
		unrotateVector(v: Vector): Vector;
		/**
		* Smoothly interpolate towards a varying target rotation
		* @param {Rotator} current - Current rotation
		* @param {Rotator} target - Target rotation
		* @param {number} deltaTime - Time since last tick
		* @param {number} interpSpeed - Interpolation speed     
		*/
		static interpolateTo(current: Rotator, target: Rotator, deltaTime: number, interpSpeed: number): Rotator;
		/**
		* Smoothly interpolate towards a varying target rotation at a constant rate
		* @param {Rotator} current - Current rotation
		* @param {Rotator} target - Target rotation
		* @param {number} deltaTime - Time since last tick
		* @param {number} interpSpeed - Interpolation speed   
		*/
		static interpolateToConstant(current: Rotator, target: Rotator, deltaTime: number, interpSpeed: number): Rotator;
		/**
		* Linearly interpolate between a and b based on alpha 
		* @param {Rotator} a - First rotation
		* @param {Rotator} b - Second rotation
		* @param {number} alpha - Result is 100% of a when alpha=0 and 100% of b when alpha=1 
		*/
		static lerp(a: Rotator, b: Rotator, alpha: number, bShortestPath: boolean): Rotator;
		/**
		* Create a rotation from an axis and and angle
		* @param {Vector} axis - The axis to rotate around
		* @param {number} angle - The amount of rotation in degrees
		*/
		static fromAxisAngle(axis: Vector, angle: number): Rotator;
	}
	
	/**
	* A point or direction in 3d space
	*/
	class Vector implements Iterable<number> {
		/**
		* Make a vector {x, y, z} from coordinate values
		* @param {number} x - X coordinate
		* @param {number} x - Y coordinate
		* @param {number} x - Z coordinate
		*/
		constructor(x: number,y: number,z: number);
		
		/**
		* X coordinate
		*/
		x: number;
		/**
		* Y coordinate
		*/
		y: number;
		/**
		* Z coordinate
		*/
		z: number;
		
		/**
		* X coordinate
		*/
		[0]: number;
		/**
		* Y coordinate
		*/
		[1]: number;
		/**
		* Z coordinate
		*/
		[2]: number;
		
		[Symbol.iterator](): Iterator<number>;
		
		/**
		* Return a copy of this Vector
		*/
		clone() : Vector;
		/**
		* Convert to a string in the form 'X= Y= Z='
		*/
		toString(): string;
		/**
		* Add another vector and return the result
		* @param {Vector} b - Vector to add
		*/
		add(b: Vector): Vector;
		/**
		* Clamp the vector length between a min and max length
		* @param {number} min - Minimum length of resulting vector
		* @param {number} max - Maximum length of resulting vector
		*/
		clampVectorMagnitude(min: number, max: number): Vector;
		/**
		* Convert to a Color with r=x g=y b=z
		*/
		toColor(): Color;
		/**
		* Create a rotator that orients X along the direction given by this vector
		*/
		toRotator(): Rotator;
		/**
		* Divide by a number
		* @param {number} b - Number to divide the vector by
		*/
		divide(b: number): Vector;
		/**
		* Compute the dot product
		* @param {Vector} b - Vector to compute the dot product with
		*/
		dot(b: Vector): number;
		/**
		* Return true if this vector is equal to vector b (a == b) within a specified error tolerance
		* @param {Vector} b - Vector to compare to
		* @param {number} errorTolerance - Maximum total difference
		*/
		equals(b: Vector, errorTolerance: number): boolean;
		/**
		* Find the closest point on an infinite line
		* @param {Vector} lineOrigin - Point of reference on the line
		* @param {Vector} lineDirection - Direction of the line
		*/
		findClosestPointOnLine(lineOrigin: Vector, lineDirection: Vector): Vector;
		/**
		* Find the closest point to this vector on a line segment
		* @param {Vector} segmentStart - Start of the segment
		* @param {Vector} segmentEnd - End of the segment
		*/
		findClosestPointOnSegment(segmentStart: Vector, segmentEnd: Vector): Vector;
		/**
		* Find a rotation for an object at this location to point at a target location
		* @param {Vector} target - Target location to point at
		*/
		findLookAtRotation(target: Vector): Rotator;
		/**
		* Find the maximum element (x, y, or y)
		*/
		getMaxElement(): number;
		/**
		* Find the minimum element (x, y, or z)
		*/
		getMinElement(): number;
		/**
		* Find the distance to the closest point on an infinite line
		* @param {Vector} lineOrigin - Point of reference on the line
		* @param {Vector} lineDirection - Direction of the line
		*/
		getDistanceToLine(lineOrigin: Vector, lineDirection: Vector): number;
		/**
		* Find the distance to the closest point on a line segment
		* @param {Vector} segmentStart - Start of the segment
		* @param {Vector} segmentEnd - End of the segment
		*/
		getDistanceToSegment(segmentStart: Vector, segmentEnd: Vector): number;
		/**
		* Returns this vector reflected across the given surface normal
		* @param {Vector} surfaceNormal - A normal of the surface to reflect on
		*/
		getReflectionVector(surfaceNormal: Vector): Vector;
		/**
		* Determines whether this vector is in a given box. Includes points on the box.
		* @param {Vector} boxOrigin - Origin of the box
		* @param {Vector} boxExtent - Extent of the box (distance in each axis from box origin)
		*/
		isInBox(boxOrigin: Vector, boxExtent: Vector): boolean;
		/**
		* Multipley element-wise (f*x, f*y, f*z)
		*/
		multiply(f: number): Vector;
		/**
		* Return negated vector
		*/
		negate(): Vector;
		/**
		* Return a unit normal version of this vector
		*/
		unit(): Vector;
		/**
		* Return result of rotating this vector around an axis
		* @param {number} angleDeg - Angle to rotate in degrees
		* @param {Vector} axis - Axis to rotate around
		*/
		rotateAngleAxis(angleDeg: number, axis: Vector): Vector;
		/**
		* Subtract another vector and return the result
		* @param {Vector} b - Vector to subtract
		*/
		subtract(b: Vector): Vector;
		/**
		* Return the length of this vector
		*/
		magnitude(): number;
		/**
		* Return the squared length of this vector
		*/
		magnitudeSquared(): number;
		/**
		* Compute the distance to another vector
		* @param {Vector} b - Vector to compute the distance to
		*/
		distance(b: Vector): number;
		/**
		* Return a random point within the specified bounding box
		* @param {Vector} origin - Origin of the box
		* @param {Vector} boxExtent - Extent of the box (distance in each axis from box origin)
		*/
		static randomPointInBoundingBox(origin: Vector, boxExtent: Vector): Vector;
		/**
		* Smoothly interpolate towards a varying target vector
		* @param {Vector} current - Current vector
		* @param {Vector} target - Target vector
		* @param {number} deltaTime - Time since last tick
		* @param {number} interpSpeed - Interpolation speed     
		*/
		static interpolateTo(current: Vector, target: Vector, deltaTime: number, interpSpeed: number): Vector;
		/**
		* Smoothly interpolate towards a varying target vector at a constant rate
		* @param {Vector} current - Current vector
		* @param {Vector} target - Target vector
		* @param {number} deltaTime - Time since last tick
		* @param {number} interpSpeed - Interpolation speed     
		*/
		static interpolateToConstant(current: Vector, target: Vector, deltaTime: number, interpSpeed: number): Vector;
		/**
		* Linearly interpolate between a and b based on alpha 
		* @param {Vector} a - First vector
		* @param {Vector} b - Second vector
		* @param {number} alpha - Result is 100% of a when alpha=0 and 100% of b when alpha=1 
		*/
		static lerp(a: Vector, b: Vector, alpha: number): Vector;
		/**
		* Find the average of an array of vectors
		* @param {Vector[]} vectors - An array of vectors to average
		*/
		static getVectorArrayAverage(vectors: Vector[]): Vector;
		/**
		* Return a random vector with a length of 1
		*/
		static randomUnitVector(): Vector;
	}

	/**
	 * Detailed information about a card.
	*/
	class CardDetails { 
		/**
		 * Index of the card as defined in the editor
		*/
		index: number;
		/**
		 * Id of the card's template
		*/
		templateId: string;
		/**
		 * Name of this card
		*/
		name: string;
	}

	/**
	 * A card or card stack
	*/
	class Card extends GameObject { 
		/**
		 * Take a stack of cards from the stack. The new stack will be positioned directly above the original stack.
		 * If the number of cards to take is as large as the stack or larger, one card will remain in the original stack.
		 * Returns undefined if this object is only a single card.
		 * @param {number} numCards - Number of cards to take. Defaults to 1.
		 * @param {boolean} fromFront - If true, take the cards from the front of the stack instead of the back.
		 * @param {number} offset - Number of cards to leave at the back (or front when fromFront is true) before taking cards. Defaults to 0.
		*/
		takeCards(numCards?: number, fromFront?: boolean, offset?: number): Card;
		/**
		 * Shuffle the card stack.
		*/
		shuffle(): void;
		/**
		 * Set whether this card stack inherits its configured script to cards taken from it (by players or using scripting). Default: false
		 * Note: This property is not saved in states.
		*/
		setInheritScript(inherit: boolean): void;
		/**
		 * Remove card from its current card holder. Does change the position of the card and does nothing if the card is not currently in a card holder.
		 * While cards are in card holders, their physical properties can't be changed and no physical forces or impulses can be applied to them.
		*/
		removeFromHolder(): void;
		/**
		 * Return whether the card is currently in a card holder
		*/
		isInHolder(): boolean;
		/**
		 * Return whether the card is currently in the hand (primary holder) of a player
		*/
		isInHand(): boolean;
		/**
		 * Return whether the front face of the card currently showing (pointing upwards)
		*/
		isFaceUp(): boolean;
		/**
		 * Get the number of cards in the stack. A single card has a stack size of 1.
		*/
		getStackSize(): number;
		/**
		 * Return the card holder this card is in.
		*/
		getHolder(): CardHolder;
		/**
		 * Return details for a card in the stack. Return undefined for an invalid index.
		 * @param {number} index - The index in the stack for which to retrieve details. Index 0 is the front card of which the face is visible.
		*/
		getCardDetails(index?: number): CardDetails;
		/**
		 * Deal a number of cards from this stack to all hands
		 * @param {number} count - The number of cards to deal to each card holder. Defaults to 1.
		 * @param {Set<number>} slots - A set of slots to identify which players receive cards. If empty, all players will receive cards.
		 * @param {boolean} faceDown - When true, cards are dealt to holders with their faces down
		*/
		deal(count?: number, slots?: number[], faceDown?: boolean): void;
		/**
		 * Add cards to the stack. Returns whether the cards have been added successfully. Will not succeed if
		 * the shape or size of the cards does not match, or if this card is in a card holder.
		 * @param {Card} cards - Card (stack) to add to the stack
		 * @param {boolean} toFront - If true, add new cards to front of the stack
		 * @param {number} offset - Number of cards to skip at the back (or front when toFront is true) before adding cards. Defaults to 0.
		*/
		addCards(cards: Card, toFront: boolean, offset?: number): boolean;
	}

	/**
	 * A card holder
	*/
	class CardHolder extends GameObject { 
		/**
		 * Called when a card is dropped onto the holder by a player
		 * @param {CardHolder} holder - The container in which the objects are dropped
		 * @param {Card} insertedCard - The newly inserted card
		 * @param {Player} player - The player who dropped the card
		 * @param {number} index - The index at which the card is inserted
		*/
		onInserted: MulticastDelegate<(holder: this, insertedCard: Card, player: Player, index: number) => void>;
		/**
		 * Called when a card is dragged from the holder by a player
		 * @param {Container} container - The holder in which the objects are dropped
		 * @param {GameObject} object - The removed object (now grabbed by the player)
		 * @param {Player} player - The player who removed the object
		*/
		onRemoved: MulticastDelegate<(holder: this, removedCard: Card, player: Player) => void>;
		/**
		 * set the player slot that owns the holder. Set to -1 to remove owner.
		 * @param {number} slot - The new owning player slot
		*/
		setOwningPlayerSlot(slot: number): void;
		/**
		 * Rotate a card on the holder (upside down). Does nothing if the card is not in the holder.
		 * @param {Card} card - The card to rotate
		*/
		rotateCard(card: Card): void;
		/**
		 * Remove a card from the holder. The removed card does not change its position.
		 * @param {number} index - The index of the card to remove
		 * @return {Card} - The removed card
		*/
		removeAt(index: number): Card;
		/**
		 * Move a card on the holder to a new position
		 * @param {Card} card - The card to move
		 * @param {number} index - New index for the card
		*/
		moveCard(card: Card, index: number): void;
		/**
		 * Insert a card into the holder. Return whether the card was inserted successfully
		 * @param {Card} card - Card to insert
		 * @param {number} index - The index at which the new objects will be inserted. By default, it will be inserted at start (index 0)
		*/
		insert(card: Card, index: number): boolean;
		/**
		 * Does the card holder hold the given card?
		 * @param {Card} card - Card to check
		*/
		holds(card: Card): boolean;
		/**
		 * Return the player slot that owns the holder. Returns -1 for holders without owner.
		*/
		getOwningPlayerSlot(): number;
		/**
		 * Return the player slot that owns the holder. Returns -1 for holders without owner.
		*/
		getOwningPlayer(): Player;
		/**
		 * Return number of cards in the holder
		*/
		getNumCards(): number;
		/**
		 * Return contained cards. Manipulating the array (e.g. removing or adding objects) does not change the contents of the holder!
		*/
		getCards(): Card[];
		/**
		 * Flips a card on the holder (back to front). Does nothing if the card is not in the holder.
		 * @param {Card} card - The card to flip
		*/
		flipCard(card: Card): void;
	}

	/**
	 * A player in the game
	*/
	class Player { 
		/**
		 * Switch the player to a new slot. Returns whether the switch was successful
		 * (it fails if another player already occupies the chosen slot)
		*/
		switchSlot(newSlot: number): boolean;
		/**
		 * Show a message on the player's screen
		*/
		showMessage(message: string): void;
		/**
		 * Set the player's secondary color
		*/
		setSecondaryColor(newColor: Color): void;
		/**
		 * Set the player's rotation. Doesn't do anything for VR players.
		*/
		setRotation(rotation: Rotator): void;
		/**
		 * Set the player's primary color
		*/
		setPrimaryColor(newColor: Color): void;
		/**
		 * Set the player's position. Doesn't do anything for VR players.
		*/
		setPosition(position: Vector): void;
		/**
		 * Set the card holder that represents the hand of the player.
		 * Can only be set to a holder that is owned by this player or a holder that has no owner.
		*/
		setHandHolder(hand: CardHolder): void;
		/**
		 * Send a message to the player's chat
		*/
		sendChatMessage(message: string, color: Color): void;
		/**
		 * Return whether the player is valid. A player becomes invalid when it drops out from the game
		*/
		isValid(): boolean;
		/**
		 * Return whether a script action key is held by the player
		*/
		isScriptKeyDown(index: number): boolean;
		/**
		 * Return whether this player is the host of the current game
		*/
		isHost(): boolean;
		/**
		 * Return whether the player is currently holding the specified object
		*/
		isHoldingObject(object: GameObject): boolean;
		/**
		 * Return whether the player is currently holding objects
		*/
		isHolding(): boolean;
		/**
		 * Return the player slot of this player (a number from 0 to 9).
		*/
		getSlot(): number;
		/**
		 * Return the objects that the player has currently selected
		*/
		getSelectedObjects(): GameObject[];
		/**
		 * Return the player's secondary color
		*/
		getSecondaryColor(): Color;
		/**
		 * Return the player's rotation
		*/
		getRotation(): Rotator;
		/**
		 * Return the player's primary color
		*/
		getPrimaryColor(): Color;
		/**
		 * Return the player's position
		*/
		getPosition(): Vector;
		/**
		 * Return the player's color
		*/
		getPlayerColor(): Color;
		/**
		 * Return the player's name
		*/
		getName(): string;
		/**
		 * Return the object that the player has currently highlighted
		*/
		getHighlightedObject(): GameObject;
		/**
		 * Return the objects that the player is currently holding
		*/
		getHeldObjects(): GameObject[];
		/**
		 * Get the card holder that represents the hand of the player
		*/
		getHandHolder(): CardHolder;
		/**
		 * Get the card holder that represents the hand of the player
		*/
		getHandCards(): Card[];
		/**
		 * Return the player's cursor velocity
		*/
		getCursorVelocity(): Vector;
		/**
		 * Return the player's cursor position
		*/
		getCursorPosition(): Vector;
	}

	/**
	 * A snap point connected to an object
	*/
	class SnapPoint { 
		/**
		 * Return whether the snap point also snaps rotation
		*/
		snapsRotation(): boolean;
		/**
		 * Return whether the object is valid. A snap point becomes invalid after the object it belongs to has been destroyed
		*/
		isValid(): boolean;
		/**
		 * Return the relative rotation around the Z axis to which the snap point snaps (if rotation snapping is active)
		*/
		getSnapRotation(): number;
		/**
		 * Return the snapping range of the snap point
		*/
		getRange(): number;
		/**
		 * Return the object to which the snap point is connected
		*/
		getParentObject(): GameObject;
		/**
		 * Get the position of the snap point relative to its parent object
		*/
		getLocalPosition(): Vector;
		/**
		 * Return the index of the snap point in the list of snap points for the object (as defined in the editor)
		*/
		getIndex(): number;
		/**
		 * Get the position of the snap point in world space
		*/
		getGlobalPosition(): Vector;
	}

	/**
	 * A container that can hold other objects
	*/
	class Container extends GameObject { 
		/**
		 * Called when objects are dropped into the container by a player
		 * @param {Container} container - The container in which the objects are dropped
		 * @param {GameObject[]} object - The newly inserted objects
		 * @param {Player} player - The player who dropped the objects
		*/
		onInserted: MulticastDelegate<(container: this, insertedObjects: GameObject[], player: Player) => void>;
		/**
		 * Called when an object is dragged from the container by a player
		 * @param {Container} container - The container from which the object is removed
		 * @param {GameObject} object - The removed object (now grabbed by the player)
		 * @param {Player} player - The player who removed the object
		*/
		onRemoved: MulticastDelegate<(container: this, removedObject: GameObject, player: Player) => void>;
		/**
		 * Remove an item from the container, move it to the provided position, and return it.
		 * Note that the item will be removed from the container even for infinite containers.
		 * @param {number} index - The index of the object to take
		 * @param {Vector} position - The position where the item should appear
		 * @param {boolean} hideAnimation - If true, don't show take animation and don't play sound
		*/
		takeAt(index: number, position: Vector, hideAnimation?: boolean): GameObject;
		/**
		 * Set the type of the container. Possible values are:
		 * 0 - Random
		 * 1 - Infinite
		 * 2 - Queue
		 * 3 - Infinite Queue
		 * 4 - Stack
		 * @param {number} newType - The new container type
		*/
		setType(newType: number): void;
		/**
		 * Remove an item from the container
		 * @param {number} index - The index of the object to remove
		*/
		removeAt(index: number): void;
		/**
		 * Insert an array of objects into the container.
		 * @param {GameObject[]} objects - Objects to insert
		 * @param {number} index - The index at which the new objects will be inserted. By default, it will be inserted at start (index 0)
		 * @param {boolean} hideAnimation - If true, don't show insert animation and don't play sound
		*/
		insert(objects: GameObject[], index: number, hideAnimation?: boolean): void;
		/**
		 * Return the type of the container. Possible values are:
		 * 0 - Random
		 * 1 - Infinite
		 * 2 - Queue
		 * 3 - Infinite Queue
		 * 4 - Stack
		*/
		getType(): number;
		/**
		 * Return number of contained objects
		*/
		getNumItems(): number;
		/**
		 * Return contained objects. Manipulating objects in the array changes the object in the container, but manipulating the array
		 * (e.g. removing or adding objects) does not change the contents of the container!
		*/
		getItems(): GameObject[];
		/**
		 * Remove all contained objects
		*/
		clear(): void;
	}

	/**
	 * An object in the game that players can interact with
	*/
	class GameObject { 
		/**
		 * Called when the object is created (from the object library, loading a game, copy & paste, dragging from an infinite container or stack...)
		 * @param {GameObject} object - The new object
		*/
		onCreated: MulticastDelegate<(object: this) => void>;
		/**
		 * Called when the object is destroyed
		 * @param {GameObject} object - The destroyed object
		*/
		onDestroyed: MulticastDelegate<(object: this) => void>;
		/**
		 * Called every tick.
		 * @param {GameObject} object - The reference object
		 * @param {number} milliseconds - Duration of the previous tick
		*/
		onTick: MulticastDelegate<(object: this, deltaTime: number) => void>;
		/**
		 * Called when the object is picked up
		 * @param {GameObject} object - The object being grabbed
		 * @param {Player} player - The player that grabbed the object
		*/
		onGrab: MulticastDelegate<(object: this, player: Player) => void>;
		/**
		 * Called when the object is released (but not snapped or reset).
		 * @param {GameObject} object - The object being released
		 * @param {Player} player - The player that released the object
		 * @param {bool} thrown - True if the object was thrown (released above a threshold velocity) instead of being dropped
		 * @param {Vector} grabPosition - The position where this object was when it was grabbed. Zero if it hasn't been grabbed (for example when it was dragged from the object library).
		 * @param {Rotator} grabRotation - The rotation this object had when it was grabbed.
		*/
		onReleased: MulticastDelegate<(object: this, player: Player, thrown: boolean, grabPosition: Vector, grabRotation: Rotator) => void>;
		/**
		 * Called when the object is snapped on releasing.
		 * @param {GameObject} object - The object being released
		 * @param {Player} player - The player that released the object
		 * @param {SnapPoint} snapPoint - The point that the object is moved to
		 * @param {Vector} grabPosition - The position where this object was when it was grabbed. Zero if it hasn't been grabbed (for example when it was dragged from the object library)
		 * @param {Rotator} grabRotation - The rotation this object had when it was grabbed.
		*/
		onSnapped: MulticastDelegate<(object: this, player: Player, snapPoint: SnapPoint, grabPosition: Vector, grabRotation: Rotator) => void>;
		/**
		 * Called when the object is reset to its position before being picked up.
		 * @param {GameObject} object - The object being reset
		 * @param {Player} player - The player that reset the object
		*/
		onReset: MulticastDelegate<(object: this, player: Player) => void>;
		/**
		 * Called when the object is hit by another object or hits another object. Gets called for both objects involved in a collision. Only called for collisions that cause an impact sound to be played.
		 * @param {GameObject} object - The first object in the collision
		 * @param {GameObject} otherObject - The second object in the collision. Can be undefined if an object collides with scenery.
		 * @param {boolean} first - True if this call is the first of the two calls made for each collision. Check this parameter if you only want to react once to a collision but both colliding objects can have the onHit event defined.
		 * @param {Vector} impactPoint - The position at which the two objects collided
		 * @param {Vector} impulse - Direction and magnitude of the impulse generated by the collision on the first object. Invert to get impulse on the second object.
		*/
		onHit: MulticastDelegate<(object: this, otherObject: GameObject, first: boolean, impactPoint: Vector, impulse: Vector) => void>;
		/**
		 * Called a player executes the primary action on an object by pressing the respective button (default mapping "R").
		 * Will be called even if the object has a defined behavior for primary actions (like dice or multistate objects),
		 * after any object defined primary action.
		 * @param {GameObject} object - The object on which the action is executed
		 * @param {Player} player - The player that executed the action
		*/
		onPrimaryAction: MulticastDelegate<(object: this, player: Player) => void>;
		/**
		 * Called a player executes the secondary action on an object by pressing the respective button (default mapping "Ctrl+R").
		 * Will be called even if the object has a defined behavior for primary actions (like card stacks or multistate objects),
		 * after any object defined primary action.
		 * @param {GameObject} object - The object on which the action is executed
		 * @param {Player} player - The player that executed the action
		*/
		onSecondaryAction: MulticastDelegate<(object: this, player: Player) => void>;
		/**
		 * Called a player executes a number action on the object (by highlighting or selecting it and pressing number keys).
		 * Will be called even if the object has a defined behavior for number actions (like dice or multistate objects), after
		 * any object defined behavior.
		 * @param {GameObject} object - The object on which the action is executed
		 * @param {Player} player - The player that executed the action
		*/
		onNumberAction: MulticastDelegate<(object: this, player: Player, number: number) => void>;
		/**
		 * Called when the object comes to rest. For ground objects or when the session is set to locked physics, the object
		 * has been locked right before this event is triggered.
		*/
		onMovementStopped: MulticastDelegate<(object: this) => void>;
		/**
		 * Tranform a world rotation to an object rotation
		 * @param {Rotator} rotation - The rotation in world space to transform to relative to the object
		*/
		worldRotationToLocal(rotation: Rotator): Rotator;
		/**
		 * Tranform a world position to an object position
		 * @param {Vector} position - The position in world space to transform to relative to the object
		*/
		worldPositionToLocal(position: Vector): Vector;
		/**
		 * Return a Json string representing the object. Can be used to spawn copies.
		*/
		toJSONString(): string;
		/**
		 * Immediately freeze the object and set its type to ground if it is currently not a ground object.
		 * Set its to regular if it is currently a ground object.
		*/
		toggleLock(): void;
		/**
		 * Snap the object to the ground below it.
		*/
		snapToGround(): void;
		/**
		 * Snap the object as if it was dropped at its current position. Does nothing if no snap point is in range below the object.
		 * Snapping in this way does not trigger the onSnapped callback. Returns the snapped point if the object was snapped.
		*/
		snap(): SnapPoint;
		/**
		 * Set surface type
		 * @param {string} - The new surface type.
		*/
		setSurfaceType(surfaceType: string): void;
		/**
		 * Set whether the object is allowed to snap
		 * @param {boolean} allowed - Whether snapping will be allowed
		*/
		setSnappingAllowed(allowed: boolean): void;
		/**
		 * Set the object's secondary color
		 * @param {Color} color - The new secondary color
		*/
		setSecondaryColor(color: Color): void;
		/**
		 * Set the object's scale instantly
		 * @param {Vector} scale - The new scale
		*/
		setScale(scale: Vector): void;
		/**
		 * Set the object's roughness value. Lower roughness makes the object more shiny.
		 * @param {number} roughness - The new roughness value, from 0 to 1
		*/
		setRoughness(roughness: number): void;
		/**
		 * Set the object's rotation instantly
		 * @param {Rotator} rotation - The new rotation
		*/
		setRotation(rotation: Rotator): void;
		/**
		 * Set the object's primary color
		 * @param {Color} color - The new primary color
		*/
		setPrimaryColor(color: Color): void;
		/**
		 * Set the object's position instantly
		 * @param {Vector} position - The new position
		*/
		setPosition(position: Vector): void;
		/**
		 * Set the object's type. Available options are defined in {@link ObjectType}:<br>
		 * 0: Regular<br>
		 * 1: Ground<br>
		 * 2: Penetrable
		 * @param {number} type - The new object type
		*/
		setObjectType(type: number): void;
		/**
		 * Set the object's user visible name
		 * @param {string} name - The new name
		*/
		setName(name: string): void;
		/**
		 * Set the object's metallic value
		 * @param {number} metallic - The new metallic value, from 0 to 1
		*/
		setMetallic(metallic: number): void;
		/**
		 * Set the object's linear velocity in cm/second.
		 * Note that setting velocity directly can lead make the physics simulation unstable, you should prefer to apply impulese or force to the object.
		 * @param {Vector} velocity - The new velocity
		*/
		setLinearVelocity(velocity: Vector): void;
		/**
		 * Set the object's unique id. Returns whether the Id was changed successfully.
		 * @param {string} id - The new unique id
		*/
		setId(iD: string): boolean;
		/**
		 * Set the object's group id. Objects with the same group id are always picked up together.
		 * @param {number} groupId - The new group id. Set to -1 to remove the object from all groups.
		*/
		setGroupId(groupID: number): void;
		/**
		 * Set the object's friction value
		 * @param {number} friction - The new friction value, from 0 to 1
		*/
		setFriction(friction: number): void;
		/**
		 * Set the object's description
		 * @param {string} description - The new object description
		*/
		setDescription(description: string): void;
		/**
		 * Set the object's density value
		 * @param {number} density - The new density value
		*/
		setDensity(density: number): void;
		/**
		 * Set the object's bounciness value
		 * @param {number} bounciness - The new bounciness value, from 0 to 1
		*/
		setBounciness(bounciness: number): void;
		/**
		 * Set the object's angular (rotational) velocity in degrees/second.
		 * Note that setting velocity directly can lead make the physics simulation unstable, you should prefer to apply impulse, torque, or force to the object.
		 * @param {Rotator} velocity - The new angular velocity
		*/
		setAngularVelocity(velocity: Rotator): void;
		/**
		 * Transform an object rotation to a world rotation
		 * @param {Rotator} rotation - The rotation relative to the object center to transform to world space
		*/
		localRotationToWorld(rotation: Rotator): Rotator;
		/**
		 * Transform an object position to a world position
		 * @param {Vector} position - The position relative to the object center to transform to world space
		*/
		localPositionToWorld(position: Vector): Vector;
		/**
		 * Return whether the object is valid. An object becomes invalid after it has been destroyed
		*/
		isValid(): boolean;
		/**
		 * Return whether the object is allowed to snap
		*/
		isSnappingAllowed(): boolean;
		/**
		 * Return whether the object is currently simulating physics. If false, the object is stuck in place and won't move when hit by other objects.
		 * This can happen with stationary ground mode objects or with locked physics sessions.
		*/
		isSimulatingPhysics(): boolean;
		/**
		 * Return the name of the object's template
		*/
		getTemplateName(): string;
		/**
		 * Return the object's template id
		*/
		getTemplateId(): string;
		/**
		 * Return surface type. Only affects sound effects when colliding with other objects.
		*/
		getSurfaceType(): string;
		/**
		 * Return a snap point of the object
		 * @param {number} index - Index of the snap point
		*/
		getSnapPoint(index: number): SnapPoint;
		/**
		 * Return the object's secondary color
		*/
		getSecondaryColor(): Color;
		/**
		 * Return the object's scale
		*/
		getScale(): Vector;
		/**
		 * Return the object's roughness value. Lower roughness makes the object more shiny.
		*/
		getRoughness(): number;
		/**
		 * Return the object's rotation
		*/
		getRotation(): Rotator;
		/**
		 * Return the object's primary color
		*/
		getPrimaryColor(): Color;
		/**
		 * Return the object's position
		*/
		getPosition(): Vector;
		/**
		 * Return the name of the package that the object's template belongs to
		*/
		getPackageName(): string;
		/**
		 * Return the id of the package that the object's template belongs to
		*/
		getPackageId(): string;
		/**
		 * Get the object's type. Possible values are defined in {@link ObjectType}:<br>
		 * 0: Regular<br>
		 * 1: Ground<br>
		 * 2: Penetrable
		*/
		getObjectType(): number;
		/**
		 * Return the object's user visible name
		*/
		getName(): string;
		/**
		 * Return the object's metallic value.
		*/
		getMetallic(): number;
		/**
		 * Return the object's mass in kg
		*/
		getMass(): number;
		/**
		 * Return the object's linear velocity in cm/s
		*/
		getLinearVelocity(): Vector;
		/**
		 * Return the object's unique id
		*/
		getId(): string;
		/**
		 * Return the object's group id. Objects with the same group id are always picked up together.
		 * Returns -1 if the object is not part of a group.
		*/
		getGroupId(): number;
		/**
		 * Return the object's friction value
		*/
		getFriction(): number;
		/**
		 * * Get the center of the object extent: an axis-aligned bounding box encompassing the object.
		 * * This will often be the same position as returned by GetPosition, but will differ for objects with their physical center not at their volume center.
		*/
		getExtentCenter(): Vector;
		/**
		 * * Get the object extent: half-size of an axis-aligned bounding box encompassing the object.
		 * * Adding this vector to the position returned by GetExtentCenter gives a corner of the bounding box.
		 * * @param {boolean} CurrentRotation - If true, return the extent of an axis-aligned bounding box around the object at its current rotation. If false, return for the default rotation.
		*/
		getExtent(currentRotation: boolean): Vector;
		/**
		 * Used when executing an object script to determine why it was executed. Possible return values:<br>
		 * "Create" - The object was newly created, for example from the object library or through copy and paste<br>
		 * "ScriptReload" - The script was reloaded, for example because it was set on the object for the first time, or because the scripting environment was reset<br>
		 * "StateLoad" - A game state that contained the object was loaded
		*/
		getExecutionReason(): string;
		/**
		 * Return the object's description
		*/
		getDescription(): string;
		/**
		 * Return the object's density value
		*/
		getDensity(): number;
		/**
		 * Returned the container that this object is in. Return undefined if the object is not in a container.
		*/
		getContainer(): Container;
		/**
		 * Return the object's center of mass
		*/
		getCenterOfMass(): Vector;
		/**
		 * Return the object's bounciness value
		*/
		getBounciness(): number;
		/**
		 * Return the object's angular (rotational) velocity in degrees/s
		*/
		getAngularVelocity(): Rotator;
		/**
		 * Return an array with all snap points of the object
		*/
		getAllSnapPoints(): SnapPoint[];
		/**
		 * Destroy the object
		*/
		destroy(): void;
		/**
		 * Apply a torque to the object. Works like 'thruster' and should be called every tick for the duration of the torque.
		 * @param {Vector} torque - The axis of rotation and magnitude of the torque to apply in kg*cm^2/s^2.
		 * @param {boolean} useMass - If false (default), ignore the mass of the object and apply the force directly as change of angular acceleration in cm^2/s^2.
		*/
		applyTorque(torque: Vector, useMass?: boolean): void;
		/**
		 * Apply an impulse to the object. Works as an instant change of velocity.
		 * @param {Vector} impulse - The direction and magnitude of the impulse to apply in kg*cm/s
		 * @param {number} position - The position where to apply the impulse, relative to the object origin. If this is not equal to the center of mass, the force will create angular velocity.
		*/
		applyImpulseAtPosition(impulse: Vector, position: Vector): void;
		/**
		 * Apply an impulse to the object. Works as an instant change of velocity.
		 * @param {Vector} impulse - The direction and magnitude of the impulse to apply in kg*cm/s.
		 * @param {boolean} useMass - If false (default), ignore the mass of the object and apply the impulse directly as change of velocity in cm/s.
		*/
		applyImpulse(impulse: Vector, useMass?: boolean): void;
		/**
		 * Apply a force to the object. Works like 'thruster' and should be called every tick for the duration of the force.
		 * @param {Vector} force - The direction and magnitude of the force to apply in kg*cm\s^2.
		 * @param {Vector} position - The position where to apply the force, relative to the object origin. If this is not equal to the center of mass, the force will create angular acceleration.
		*/
		applyForceAtPosition(force: Vector, position: Vector): void;
		/**
		 * Apply a force to the object. Works like 'thruster' and should be called every tick for the duration of the force.
		 * @param {Vector} force - The direction and magnitude of the force to apply in kg*cm/s^2.
		 * @param {boolean} useMass - If false (default), ignore the mass of the object and apply the force directly as change of acceleration in cm/s^2.
		*/
		applyForce(force: Vector, useMass?: boolean): void;
		/**
		 * Apply a torque to the object. Works as an instant change of angular velocity.
		 * @param {Vector} impulse - The axis of rotation and magnitude of the impulse to apply in kg*cm^2/s.
		 * @param {boolean} useMass - If false (default), ignore the mass of the object and apply the force directly as change of angular velocity in cm^2/s.
		*/
		applyAngularImpulse(impulse: Vector, useMass?: boolean): void;
	}

	/**
	 * A result from a trace
	*/
	class TraceHit { 
		/**
		 * The object that was hit
		*/
		object: GameObject;
		/**
		 * The distance from the start of the trace to the Location in world space. This value is 0 if there was an initial overlap (trace started inside another colliding object).
		*/
		distance: number;
		/**
		 * The position where the moving shape would end up against the impacted object. Equal to the point of impact for line tests.
		 * Example: for a sphere trace test, this is the point where the center of the sphere would be located when it touched the other object.
		*/
		position: Vector;
		/**
		 * Position of the actual contact of the trace shape (box, sphere, line) with the impacted object.
		 * Example: for a sphere trace test, this is the point where the surface of the sphere touches the other object.
		*/
		impactPosition: Vector;
		/**
		 * Normal of the hit in world space, for the object that was hit by the sweep, if any.
		 * For example if a box hits a flat plane, this is a normalized vector pointing out from the plane.
		*/
		normal: Vector;
		clone() : TraceHit;
	}

	/**
	 * JSConsole
	*/
	class JSConsole { 
		/**
		 * Warn
		*/
		static warn(message: string): void;
		/**
		 * Log
		*/
		static log(message: string): void;
		/**
		 * Info
		*/
		static info(message: string): void;
		/**
		 * Error
		*/
		static error(message: string): void;
		/**
		 * Debug
		*/
		static debug(message: string): void;
	}

	/**
	 * A dice object
	*/
	class Dice extends GameObject { 
		/**
		 * Set the rotation so the face with the given index points up
		 * @param {number} index - The index of the face to turn up
		*/
		setCurrentFace(index: number): void;
		/**
		 * Roll in place.
		 * @param {Player} player - Optional: the player that initiated the dice roll. Only rolls by players get included in the OnDiceRolled event.
		*/
		roll(player?: Player): void;
		/**
		 * Return the number of faces for this dice type
		*/
		getNumFaces(): number;
		/**
		 * Return the directions of all faces for this dice type, from the center of the object
		*/
		getFaceDirections(): Vector[];
		/**
		 * Return name of face that is currently pointing up
		*/
		getCurrentFaceName(): string;
		/**
		 * Return index of face that is currently pointing up. Return -1 if the object is invalid.
		*/
		getCurrentFaceIndex(): number;
		/**
		 * Return all face names for this dice type
		*/
		getAllFaceNames(): string[];
	}

	/**
	 * The game world
	*/
	class GameWorld { 
		/**
		 * Start debug mode on the given port. You can use the Chrome DevTools or the Visual Studio Code debugger
		 * to connect to the specified port and debug your scripts.
		 * For example, with port 9229 (the default), open the following URL to open the DevTools:
		 * devtools://devtools/bundled/inspector.html?experiments=true&v8only=true&ws=localhost:9229
		 * For Visual Studio Code, add the following to your debug configurations:
		 * {
		 *   "name": "Inspector",
		 *       "type": "node",
		 *       "protocol": "inspector",
		 *       "request": "attach",
		 *       "address": "localhost",
		 *       "port": 9229
		 * }
		*/
		startDebugMode(port?: number): void;
		/**
		 * Find all objects hits with a sphere that is moved along a line, ordered by distance to start
		 * @param {Vector} start - Starting point of the sphere
		 * @param {Vector} end - End point of the sphere movement
		 * @param {number} radius - Radius of the sphere
		*/
		sphereTrace(start: Vector, end: Vector, radius: number): TraceHit[];
		/**
		 * Find all objects that would collide with a sphere
		 * @param {Vector} position - Center of the sphere
		 * @param {number} radius - Radius of the sphere
		*/
		sphereOverlap(position: Vector, radius: number): GameObject[];
		/**
		 * Reset scripting environment and reload all scripts
		*/
		resetScripting(): void;
		/**
		 * Reload all scripts: global script and all object scripts
		*/
		reloadScripts(): void;
		/**
		 * Find all object hits on the given line, ordered by distance to start
		 * @param {Vector} start - Starting point of the line
		 * @param {Vector} end - End point of the line
		*/
		lineTrace(start: Vector, end: Vector): TraceHit[];
		/**
		 * Return the player occupying the specified slot
		 * @param {number} slot - The player slot (0-9)
		*/
		getPlayerBySlot(slot: number): Player;
		/**
		 * Return an array of all objects with a given object group id.
		 * @param {number} groupId - The group id to query
		*/
		getObjectsByGroupId(groupID: number): GameObject[];
		/**
		 * Return an array of all currently used object group ids.  Objects with the same group id are always picked up together.
		*/
		getObjectGroupIds(): number[];
		/**
		 * Return the game object with the specified Id
		 * @param {string} objectId - The unique id of the object
		*/
		getObjectById(objectId: string): GameObject;
		/**
		 * Return the time in seconds since the game session was started
		*/
		getGameTime(): number;
		/**
		 * Used while executing the global script to determine why it was executed. Possible return values:<br>
		 * "ScriptReload" - The script was reloaded, for example because it was set in the session options, or because the scripting environment was reset<br>
		 * "StateLoad" - A game state that has the script set as global script was loaded<br>
		 * "" - If called at other times
		*/
		getExecutionReason(): string;
		/**
		 * Return all players currently in the game
		*/
		getAllPlayers(): Player[];
		/**
		 * Get all objects currently in the game
		*/
		getAllObjects(): GameObject[];
		/**
		 * Draw a point. The sphere will only be visible on for the host!
		 * @param {Vector} position - Position of the point
		 * @param {number} size - Radius of the sphere in cm
		 * @param {Color} color - Color of the sphere. Alpha value is not used.
		 * @param {number} duration - Amount of time in seconds to show the point. Can be 0 to show for one frame only.
		 * @param {number} thickness - Thickness of the lines. One pixel thick if 0, cm thickness for values > 0.
		*/
		drawDebugSphere(position: Vector, radius: number, color: Color, duration: number, thickness?: number): void;
		/**
		 * Draw a point. The point will only be visible on for the host!
		 * @param {Vector} position - Position of the point
		 * @param {number} size - Size of the point in cm
		 * @param {Color} color - Color of the point. Alpha value is not used.
		 * @param {number} duration - Amount of time in seconds to show the point. Can be 0 to show for one frame only.
		*/
		drawDebugPoint(position: Vector, size: number, color: Color, duration: number): void;
		/**
		 * Draw a line in 3d space. The line will only be visible on for the host!
		 * @param {Vector} start - Starting point of the line
		 * @param {Vector} end - End point of the line
		 * @param {Color} color - Color of the line. Alpha value is not used.
		 * @param {number} duration - Amount of time in seconds to show the line. Can be 0 to show for one frame only
		 * @param {number} thickness - Thickness of the line. One pixel thick if 0, cm thickness for values > 0.
		*/
		drawDebugLine(start: Vector, end: Vector, color: Color, duration: number, thickness?: number): void;
		/**
		 * Draw a box in 3d space. The box will only be visible on for the host!
		 * @param {Vector} center - The center of the box
		 * @param {Vector} extent - Maximum point of the box
		 * @param {Rotator} orientation - The rotation of the box
		 * @param {Color} color - Color of the box. Alpha value is not used.
		 * @param {number} duration - Amount of time in seconds to show the box. Can be 0 to show for one frame only.
		 * @param {number} thickness - Thickness of the lines. One pixel thick if 0, cm thickness for values > 0.
		*/
		drawDebugBox(center: Vector, extent: Vector, orientation: Rotator, color: Color, duration: number, thickness?: number): void;
		/**
		 * Create a new object from a template
		 * @param {string} templateId - Template GUID for the new object
		 * @param {Vector} position - Starting position
		*/
		createObjectFromTemplate(templateId: string, position: Vector): GameObject;
		/**
		 * Create a new object from a JSON string
		 * @param {string} jsonString - String containing Json representation of an object (can be obtained by calling toJSONString() on an object)
		 * @param {Vector} position - Starting position
		*/
		createObjectFromJSON(jsonString: string, position: Vector): GameObject;
		/**
		 * Find all objects hits with a capsule that is moved along a line, ordered by distance to start
		 * @param {Vector} start - Starting point of the capsule
		 * @param {Vector} end - End point of the capsule movement
		 * @param {Vector} extent - Dimensions of the capsule
		 * @param {Rotator} orientation - Orientation of the capsule
		*/
		capsuleTrace(start: Vector, end: Vector, extent: Vector, orientation?: Rotator): TraceHit[];
		/**
		 * Find all objects that would collide with a capsule
		 * @param {Vector} position - Center of the capsule
		 * @param {Vector} extent - Dimensions of the capsule (from center to one of the corners of the surrounding box)
		 * @param {Rotator} orientation - Orientation of the capsule
		*/
		capsuleOverlap(position: Vector, extent: Vector, orientation?: Rotator): GameObject[];
		/**
		 * Send a chat message to all players
		 * @param {string} slot - Message to send
		 * @param {Color} slot - Color of the message
		*/
		broadcastChatMessage(message: string, color: Color): void;
		/**
		 * Find all object hits with a box that is moved along a line, ordered by distance to start
		 * @param {Vector} start - Starting point of the box
		 * @param {Vector} end - End point of box movement
		 * @param {Vector} extent - Dimensions of the box (from center to on of the corners)
		 * @param {Rotator} orientation - Orientation of the box
		*/
		boxTrace(start: Vector, end: Vector, extent: Vector, orientation?: Rotator): TraceHit[];
		/**
		 * Find all objects that would collide with a box
		 * @param {Vector} position - Center of the box
		 * @param {Vector} extent - Dimensions of the box (from center to on of the corners)
		 * @param {Rotator} orientation - Orientation of the box
		*/
		boxOverlap(position: Vector, extent: Vector, orientation?: Rotator): GameObject[];
	}

	/**
	 * Global scripting event callbacks
	*/
	class GlobalScriptingEvents { 
		/**
		 * Called every tick.
		 * @param {number} milliseconds - Duration of the previous tick
		*/
		onTick: MulticastDelegate<(milliseconds: number) => void>;
		/**
		 * Called when a player presses a script action button. Per default, the script buttons are mapped to the numpad.
		 * Players can re-assign them in the interface settings.
		 * @param {Player} player - Player that pressed the button
		 * @param {number} index - Index of the action (1-10)
		*/
		onScriptButtonPressed: MulticastDelegate<(player: Player, index: number) => void>;
		/**
		 * Called when a player releases a script action button.
		 * @param {Player} player - Player that pressed the button
		 * @param {number} index - Index of the action (1-10)
		*/
		onScriptButtonReleased: MulticastDelegate<(player: Player, index: number) => void>;
		/**
		 * Called when a player sends a chat message
		 * @param {Player} sender - Player that sent the message
		 * @param {string} message - The chat message
		*/
		onChatMessage: MulticastDelegate<(sender: Player, message: string) => void>;
		/**
		 * Called when a player joins the game
		 * @param {Player} player - The new player
		*/
		onPlayerJoined: MulticastDelegate<(player: Player) => void>;
		/**
		 * Called when a player leaves the game
		 * @param {Player} player - The new player
		*/
		onPlayerLeft: MulticastDelegate<(player: Player) => void>;
		/**
		 * Called when a player has switched slots
		 * @param {Player} player - Player that switched slots (already at new slot)
		 * @param {number} oldIndex - Previous player index
		*/
		onPlayerSwitchedSlots: MulticastDelegate<(player: Player, index: number) => void>;
		/**
		 * Called when an object is created (from the object library, loading a game, copy & paste, dragging from a container or stack...)
		 * @param {GameObject} object - The new object
		*/
		onObjectCreated: MulticastDelegate<(object: GameObject) => void>;
		/**
		 * Called when an object is destroyed
		 * @param {GameObject} object - The destroyed object
		*/
		onObjectDestroyed: MulticastDelegate<(object: GameObject) => void>;
		/**
		 * Called when a player has rolled dice, once the dice have come to rest. Called directly after the dice roll message is sent.
		 * @param {Player} player - Player that rolled the dice
		 * @param {Dice[]} dice - Array of Dice objects that were rolled
		*/
		onDiceRolled: MulticastDelegate<(player: Player, dice: Dice[]) => void>;
	}

	/**
	 * A multistate object
	*/
	class MultistateObject extends GameObject { 
		/**
		 * Called when the the state of the object changes
		 * @param {MultistateObject} object - The reference object
		 * @param {number} newState - The new state
		 * @param {number} oldState - The state the object was in before the change
		*/
		onStateChanged: MulticastDelegate<(multistateObject: this, newState: number, oldState: number) => void>;
		/**
		 * Set the state of the object. Will not trigger the onStateChanged event.
		 * @param {number} state - The new state of the object. State will not change if the state index is not valid for this object.
		*/
		setState(state: number): void;
		/**
		 * Set the object to a random state. Will not trigger the onStateChanged event.
		*/
		setRandomState(): void;
		/**
		 * Return the current state of this object. Return -1 if the object is invalid.
		*/
		getState(): number;
		/**
		 * Return the number of possible states for this object
		*/
		getNumStates(): number;
	}

	var globalEvents : GlobalScriptingEvents;
	var world : GameWorld;

	/** Only available in object scripts (for all object types) */
	var refObject : GameObject;
	/** Only available in card object scripts */
	var refCard : Card;
	/** Only available in card holder object scripts */
	var refHolder : CardHolder;
	/** Only available in container object scripts */
	var refContainer : Container;
	/** Only available in dice object scripts */
	var refDice : Dice;
	/** Only available in multistate object scripts */
	var refMultistate : MultistateObject;
}
