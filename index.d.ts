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

/**
 * Global exception handler: called with the error message whenever an unhandled exception occurs.
 * Set to a function to use, for example: <pre>$uncaughtException = (err) => console.log(err);</pre>
*/
declare var $uncaughtException: ((error: string) => void) | undefined;

declare module '@tabletop-playground/api' {
	/** The object type used in {@link GameObject.getObjectType} and {@link GameObject.setObjectType}*/
	enum ObjectType {
		/** Standard object behavior: physics stay activated (if locked physics is not enabled), collides with other regular and ground objects */
		Regular=0,
		/** Physics get locked when object is at rest, collides with all object types */
		Ground=1,
		/** Physics stay activated as for regular objects, does not collide with other penetrable or regular objects */
		Penetrable=2,
		/** Physics are locked, players cannot interact with the object at all: it behaves like a table */
		NonInteractive=3
	}

	/** The zone shape used in {@link Zone.getShape} and {@link Zone.setShape}*/
	enum ZoneShape {Box=0, Cylinder=1, Hexagon=2}

	/** The zone permission types used in {@link Zone}*/
	enum ZonePermission {Everybody=0, OwnersOnly=1, Nobody=2}

	/** Justification (alignment) used in {@link Text}*/
	enum TextJustification {Left=0, Center=1, Right=2}

	/** Widget alignment used in {@link LayoutBox} and {@link Panel}*/
	enum HorizontalAlignment {Fill=0, Left=1, Center=2, Right=3}

	/** Widget alignment used in {@link LayoutBox} and {@link Panel}*/
	enum VerticalAlignment {Fill=0, Top=1, Center=2, Bottom=3}

	/** Behavior for hidden cards used in {@link CardHolder}*/
	enum HiddenCardsType {GreyBlur=0, Back=1, Front=2}

	/** Shape of snap points used in {@link SnapPoint}*/
	enum SnapPointShape {Sphere=0, Cylinder=1, Box=2}

	/** Type of snap point rotation used in {@link SnapPoint}*/
	enum SnapPointRotationType {NoChange=0, NoFlip=1, RotateNoFlip=2, RotateUpright=3, RotateUpsideDown=4}

	/** When a snap point is valid depending on whether its object is flipped, used in {@link SnapPoint}*/
	enum SnapPointFlipValidity {Always=0, Upright=1, UpsideDown=2}

	/** Presentation style for UI elements, used for {@link UIElement.presentationStyle} */
	enum UIPresentationStyle {
		/** The UI element is shown in 3D space, as defined by its position, rotation, and scale. */
		Regular=0,
		/** The UI element is shown at its position and with its scale. Rotation is not used and instead the UI is always facing the camera */
		ViewAligned=1,
		/** The UI element is shown in 2D on the screen at its position. Rotation and scale are not used, the size on screen corresponds to the
			size of the UI element. {@link UIElement.useTransparency} does not have an effect, screen UIs can always be partly transparent.
			Screen presentation is not possible in VR, and the UI will fall back to {@link ViewAligned} for VR players, so make sure to
			set an appropriate scale even when using screen mode. */
		Screen=2
	}

	/** Visibility of UI elements depending on whether the object is zoomed, used for {@link UIElement.zoomVisibility} */
	enum UIZoomVisibility {
		/** The UI element is only shown for the regular object. */
		Regular=0,
		/** The UI element is only shown for a zoomed object (in object zoom) */
		ZoomedOnly=1,
		/** The UI element is shown for both the regular and the zoomed object */
		Both=2
	}

	/** Type of the snap grid, used in {@link GlobalGrid}*/
	enum GridType {Rectangular=0, Hexagonal=1}

	/** Where objects snap on the grid, used in {@link GlobalGrid}*/
	enum GridSnapType {None=0, Center=1, Corners=2, Both=3}

	/** If and where the snap grid is visible, used in {@link GlobalGrid}*/
	enum GridVisibility {None=0, Table=1, TableAndGround=2}

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
	* Options for an HTTP request
	*/
	interface FetchOptions {
		/**
		 * The payload to send with the request
		 */
		body?: string;
			
		/**
		 * HTTP headers used for the request
		 */
		headers?: Record<string, string>;

		/**
		 * A string to set request's method. If undefined, GET will be used.
		 */
		method?: "GET" | "POST" | "PUT" | "DELETE";
	}
	
	/**
	* Represents a response to an HTTP request
	*/
	class FetchResponse {
		/**
		* HTTP status code
		*/
		status: number;

		/**
		* True if the request was successful (status in range 200-299)
		*/
		ok: boolean;
		
		/**
		* The URL that was used for the request
		*/
        url: string;

		/**
		* Return the response content as plain text
		*/
		text(): string;

		/**
		* Return the response as a JSON object
		*/
		json(): object;
	}
	
	/**
	* Fetch resources from a url according to the given options, returning a promise
	* that will resolve to the response.
	*
	* Example usage: `fetch('https://postman-echo.com/get?foo1=bar1&foo2=bar2').then(res => console.log(JSON.stringify(res.json())))`
	*
	* @param {string} url - The URL to fetch
	* @param {FetchOptions} options - Options for how to call the URL
	* @returns {Promise<FetchResponse>} - A promise that resolves to a response object once the request has finished
	*/
	function fetch(url: string, options?: FetchOptions): Promise<FetchResponse>;
	
	/**
	* A color represented by RGB components. The range for each component is from 0 to 1.
	*/
	class Color implements Iterable<number> { 
		/**
		* Make a color from individual color components (RGB space). Each component can have values between 0 and 1.
		* @param {number} r - Red component. Default: 0
		* @param {number} g - Green component. Default: 0
		* @param {number} b - Blue component. Default: 0
		* @param {number} a - Alpha component. Default: 1
		*/
		constructor(r: number, g: number, b: number, a?: number);
		
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
		* Convert to a hexadecimal string in the form 'RRGGBBAA'
		*/
		toHex(): string;
		/**
		* Convert to a vector, with x=r y=g z=b
		*/
		toVector(): Vector;
		/**
		* Multiply element-wise (f\*r, f\*g, f\*b, f\*a)
		*/
		multiply(f: number): Color;
		/**
		* Smoothly interpolate towards a varying target color
		* @param {Color} current - Current color
		* @param {Color} target - Target color
		* @param {number} deltaTime - Time since last tick
		* @param {number} interpSpeed - Interpolation speed          
		*/
		static interpolateTo(current: Color | [r: number, g: number, b: number, a: number], target: Color | [r: number, g: number, b: number, a: number], deltaTime: number, interpSpeed: number): Color;
		/**
		* Linearly interpolate between a and b based on alpha 
		* @param {Color} a - First color
		* @param {Color} b - Second color
		* @param {number} alpha - Result is 100% of a when alpha=0 and 100% of b when alpha=1
		*/
		static lerp(a: Color | [r: number, g: number, b: number, a: number], b: Color | [r: number, g: number, b: number, a: number], alpha: number): Color;
	}
	
	/**
	* An orthogonal rotation in 3d space
	*/
	class Rotator implements Iterable<number> {
		/**
		* Make a rotator {Pitch, Yaw, Roll} from rotation values
		* @param {number} pitch - Rotation around Y axis in degrees
		* @param {number} yaw - Rotation around Z axis in degrees
		* @param {number} roll - Rotation around X axis in degrees
		*/
		constructor(pitch: number, yaw: number, roll: number);
		
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
		compose(b: Rotator | [pitch: number, yaw: number, roll: number]): Rotator;
		/**
		* Get the X direction vector after this rotation
		*/
		toVector(): Vector;
		/**
		* Return true if this rotator is equal to rotator b (a == b) within a specified error tolerance
		* @param {Rotator} b - Rotator to compare to
		* @param {number} errorTolerance - Maximum total difference
		*/
		equals(b: Rotator | [pitch: number, yaw: number, roll: number], errorTolerance: number): boolean;
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
		* Return negated rotator. For the inverse rotation, use {@link getInverse}.
		*/
		negate(): Rotator;
		/**
		* Return a vector rotated by this rotation
		*/
		rotateVector(v: Vector | [x: number, y: number, z: number]): Vector;
		/**
		* Return a vector rotated by the inverse of this rotation
		*/
		unrotateVector(v: Vector | [x: number, y: number, z: number]): Vector;
		/**
		* Return the inverse rotation that can reverse the rotation defined by this rotator. For rotations around multiple axis,
		* this is not generally the same as the result from {@link negate}.
		*/
		getInverse(): Rotator;
		/**
		* Smoothly interpolate towards a varying target rotation
		* @param {Rotator} current - Current rotation
		* @param {Rotator} target - Target rotation
		* @param {number} deltaTime - Time since last tick
		* @param {number} interpSpeed - Interpolation speed     
		*/
		static interpolateTo(current: Rotator | [pitch: number, yaw: number, roll: number], target: Rotator | [pitch: number, yaw: number, roll: number], deltaTime: number, interpSpeed: number): Rotator;
		/**
		* Smoothly interpolate towards a varying target rotation at a constant rate
		* @param {Rotator} current - Current rotation
		* @param {Rotator} target - Target rotation
		* @param {number} deltaTime - Time since last tick
		* @param {number} interpSpeed - Interpolation speed   
		*/
		static interpolateToConstant(current: Rotator | [pitch: number, yaw: number, roll: number], target: Rotator | [pitch: number, yaw: number, roll: number], deltaTime: number, interpSpeed: number): Rotator;
		/**
		* Linearly interpolate between a and b based on alpha 
		* @param {Rotator} a - First rotation
		* @param {Rotator} b - Second rotation
		* @param {number} alpha - Result is 100% of a when alpha=0 and 100% of b when alpha=1 
		*/
		static lerp(a: Rotator | [pitch: number, yaw: number, roll: number], b: Rotator | [pitch: number, yaw: number, roll: number], alpha: number, bShortestPath: boolean): Rotator;
		/**
		* Create a rotation from an axis and and angle
		* @param {Vector} axis - The axis to rotate around
		* @param {number} angle - The amount of rotation in degrees
		*/
		static fromAxisAngle(axis: Vector | [x: number, y: number, z: number], angle: number): Rotator;
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
		add(b: Vector | [x: number, y: number, z: number]): Vector;
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
		dot(b: Vector | [x: number, y: number, z: number]): number;
		/**
		* Return true if this vector is equal to vector b (a == b) within a specified error tolerance
		* @param {Vector} b - Vector to compare to
		* @param {number} errorTolerance - Maximum total difference
		*/
		equals(b: Vector | [x: number, y: number, z: number], errorTolerance: number): boolean;
		/**
		* Find the closest point on an infinite line
		* @param {Vector} lineOrigin - Point of reference on the line
		* @param {Vector} lineDirection - Direction of the line
		*/
		findClosestPointOnLine(lineOrigin: Vector | [x: number, y: number, z: number], lineDirection: Vector | [x: number, y: number, z: number]): Vector;
		/**
		* Find the closest point to this vector on a line segment
		* @param {Vector} segmentStart - Start of the segment
		* @param {Vector} segmentEnd - End of the segment
		*/
		findClosestPointOnSegment(segmentStart: Vector | [x: number, y: number, z: number], segmentEnd: Vector | [x: number, y: number, z: number]): Vector;
		/**
		* Find a rotation for an object at this location to point at a target location
		* @param {Vector} target - Target location to point at
		*/
		findLookAtRotation(target: Vector | [x: number, y: number, z: number]): Rotator;
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
		getDistanceToLine(lineOrigin: Vector | [x: number, y: number, z: number], lineDirection: Vector | [x: number, y: number, z: number]): number;
		/**
		* Find the distance to the closest point on a line segment
		* @param {Vector} segmentStart - Start of the segment
		* @param {Vector} segmentEnd - End of the segment
		*/
		getDistanceToSegment(segmentStart: Vector | [x: number, y: number, z: number], segmentEnd: Vector | [x: number, y: number, z: number]): number;
		/**
		* Returns this vector reflected across the given surface normal
		* @param {Vector} surfaceNormal - A normal of the surface to reflect on
		*/
		getReflectionVector(surfaceNormal: Vector | [x: number, y: number, z: number]): Vector;
		/**
		* Determines whether this vector is in a given box. Includes points on the box.
		* @param {Vector} boxOrigin - Origin of the box
		* @param {Vector} boxExtent - Extent of the box (distance in each axis from box origin)
		*/
		isInBox(boxOrigin: Vector | [x: number, y: number, z: number], boxExtent: Vector | [x: number, y: number, z: number]): boolean;
		/**
		* Multipley element-wise (f\*x, f\*y, f\*z)
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
		rotateAngleAxis(angleDeg: number, axis: Vector | [x: number, y: number, z: number]): Vector;
		/**
		* Subtract another vector and return the result
		* @param {Vector} b - Vector to subtract
		*/
		subtract(b: Vector | [x: number, y: number, z: number]): Vector;
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
		distance(b: Vector | [x: number, y: number, z: number]): number;
		/**
		* Return a random point within the specified bounding box
		* @param {Vector} origin - Origin of the box
		* @param {Vector} boxExtent - Extent of the box (distance in each axis from box origin)
		*/
		static randomPointInBoundingBox(origin: Vector | [x: number, y: number, z: number], boxExtent: Vector | [x: number, y: number, z: number]): Vector;
		/**
		* Smoothly interpolate towards a varying target vector
		* @param {Vector} current - Current vector
		* @param {Vector} target - Target vector
		* @param {number} deltaTime - Time since last tick
		* @param {number} interpSpeed - Interpolation speed     
		*/
		static interpolateTo(current: Vector | [x: number, y: number, z: number], target: Vector | [x: number, y: number, z: number], deltaTime: number, interpSpeed: number): Vector;
		/**
		* Smoothly interpolate towards a varying target vector at a constant rate
		* @param {Vector} current - Current vector
		* @param {Vector} target - Target vector
		* @param {number} deltaTime - Time since last tick
		* @param {number} interpSpeed - Interpolation speed     
		*/
		static interpolateToConstant(current: Vector | [x: number, y: number, z: number], target: Vector | [x: number, y: number, z: number], deltaTime: number, interpSpeed: number): Vector;
		/**
		* Linearly interpolate between a and b based on alpha 
		* @param {Vector} a - First vector
		* @param {Vector} b - Second vector
		* @param {number} alpha - Result is 100% of a when alpha=0 and 100% of b when alpha=1 
		*/
		static lerp(a: Vector | [x: number, y: number, z: number], b: Vector | [x: number, y: number, z: number], alpha: number): Vector;
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
	 * Detailed information about a card. Changing the properties in this class does not affect the card.
	*/
	class CardDetails { 
		/**
		 * Index of the card as defined in the editor. Index 0 corresponds to the upper left card in the
		 * card image.
		*/
		readonly index: number;
		/**
		 * Index of the card within the stack at the time when this object was created.
		*/
		readonly stackIndex: number;
		/**
		 * Id of the card's template
		*/
		readonly templateId: string;
		/**
		 * Name of the card as defined in the editor. Not the same as the name of the object for single cards,
		 * which is accessible through {@link GameObject.getName}
		*/
		readonly name: string;
		/**
		 * Metadata of the card. Set in the editor, can contain JSON encoded information.
		*/
		readonly metadata: string;
		/**
		 * URL for texture override. Used instead of regular front texture if not empty.
		*/
		readonly textureOverrideURL: string;
		/**
		 * Is the card flipped compared to the orientation of the stack?
		 * Single cards are never flipped.
		*/
		readonly flipped: boolean;
		/**
		 * Tags defined for this card
		*/
		readonly tags: string[];
	}

	/**
	 * A stack of cards. Also represents single cards as a stack of one card.
	*/
	class Card extends GameObject { 
		/**
		 * Called after a card (or stack of cards) is added to this card.
		 * Not called immediately when a player drops a card, but when the animation finishes.
		 * @param {Card} card - The target card, with the new card already inserted.
		 * @param {Card} insertedCard - The newly inserted card. Only used for information about what was inserted,
		 * this object gets deleted immediately after the call ends.
		 * @param {number} position - The position in the stack at which the card was inserted. 0 when dropped to the front,
		 * number of cards in the stack before inserting when dropped to the back
		 * @param {Player} player - The player who added a card. undefined if the card was added through scripting.
		*/
		onInserted: MulticastDelegate<(card: this, insertedCard: Card, position: number, player: Player | undefined) => void>;
		/**
		 * Called after a card is removed from the stack by a player. This can happen when a player drags a card off the stack or
		 * the container explorer, when drawing or dealing cards, or when a player cuts/splits/divides the stack. In the last case,
		 * the removed card object may be a stack of cards.
		 * @param {Card} card - The card stack from which the object is removed
		 * @param {Card} removedCard - The removed card (now grabbed by the player)
		 * @param {number} position - The position in the stack from which the card was removed. 0 when removed from the front,
		 * number of cards in the after removing when removed from the back
		 * @param {Player} player - The player who removed the card
		*/
		onRemoved: MulticastDelegate<(card: this, removedCard: Card, position: number, player: Player) => void>;
		/**
		 * Take a stack of cards from the stack. The new stack will be positioned directly above the original stack.
		 * If the number of cards to take is as large as the stack or larger, one card will remain in the original stack.
		 * Returns undefined if this object is only a single card.
		 * @param {number} numCards - Number of cards to take. Defaults to 1.
		 * @param {boolean} fromFront - If true, take the cards from the front of the stack instead of the back. Default: false
		 * @param {number} offset - Number of cards to leave at the back (or front when fromFront is true) before taking cards. Default: 0
		 * @param {boolean} keep - If true, keep the taken cards in the stack and take a copy. Default: false
		*/
		takeCards(numCards?: number, fromFront?: boolean, offset?: number, keep?: boolean): Card | undefined;
		/**
		 * Split the card stack into a fixed number of smaller stacks with equal size. Some of the stacks will have one
		 * card more than others if the current stack size is not divisible by the number of stacks.
		 * @param {number} numStacks - Number of stacks to split into
		 * @returns {Card[]} - The newly created stacks, starting with the stack at the bottom as the first item
		*/
		split(numStacks: number): Card[];
		/**
		 * Shuffle the card stack.
		*/
		shuffle(): void;
		/**
		 * Set the URL of the online texture override for a card in this stack.
		 * @param {string} url - URL to use
		 * @param {number} index - The index in the stack for which to update the texture override. Index 0 is the front card of which the face is visible.
		 * Default: 0
		*/
		setTextureOverrideURLAt(url: string, index?: number): void;
		/**
		 * Set the URL of the online texture override for all cards in this stack. When called for card stacks where all cards don't use a texture
		 * atlas (i.e. the whole image is used as the card front), the scale of the object is updated to reflect the correct aspect ratio of
		 * the new image after it has been loaded.
		 * @param {string} url - URL to use
		*/
		setTextureOverrideURL(url: string): void;
		/**
		 * Set whether this card stack inherits its configured script to cards taken from it (by players or using scripting). By default, script inheritance
		 * is enabled. Note: This property is not saved in states.
		*/
		setInheritScript(inherit: boolean): void;
		/**
		 * Set the card index of a card in the stack. This index corresponds to {@link CardDetails.index}, changing it will show a different card face.
		 * @param {number} cardIndex - The new card index. Only indices that are used in the template for the card (as defined in the editor) are allowed.
		 * Card index 0 corresponds to the upper left card on the card image.
		 * @param {number} index -  The index in the stack for which to update the card index. Index 0 is the front card of which the face is visible.
		 * Default: 0
		*/
		setCardIndexAt(cardIndex: number, index?: number): void;
		/**
		 * Remove card from its current card holder. Does change the position of the card and does nothing if the card is not currently in a card holder.
		 * While cards are in card holders, their physical properties can't be changed and no physical forces or impulses can be applied to them.
		*/
		removeFromHolder(): void;
		/**
		 * Move a card to a new position within the stack
		 * @param {number} from - The current index of the card to be moved
		 * @param {number} to - The new index of the card to be moved
		*/
		moveCardInStack(from: number, to: number): void;
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
		getHolder(): CardHolder | undefined;
		/**
		 * Return details for a card in the stack. Return undefined for an invalid index.
		 * @param {number} index - The index in the stack for which to retrieve details. Index 0 is the front card of which the face is visible.
		*/
		getCardDetails(index: number): CardDetails | undefined;
		/**
		 * Return details for the first card in the stack.
		*/
		getCardDetails(): CardDetails;
		/**
		 * Return details for all cards in the stack.
		*/
		getAllCardDetails(): CardDetails[];
		/**
		 * Divide the card stack into a number of smaller stacks, each with the given number of cards. One of the stacks
		 * will be smaller if the current stack size is not divisible by the number of cards.
		 * @param {number} numCards - Number of cards in each stack
		 * @returns {Card[]} - The newly created stacks, starting with the stack at the bottom as the first item
		*/
		divide(numCards: number): Card[];
		/**
		 * Deal a number of cards from this stack to all hands
		 * @param {number} count - The number of cards to deal to each card holder. Defaults to 1.
		 * @param {Set<number>} slots - A set of slots to identify which players receive cards. If empty, all players will receive cards.
		 * @param {boolean} faceDown - When true, cards are dealt with their faces down. Default: false
		 * @param {boolean} dealToAllHolders - When false, only card holders that are the primary holder of an active player will receive cards.
		 * When true, all card holders (except those without an owner slot) will receive a card. Default: false
		*/
		deal(count?: number, slots?: number[], faceDown?: boolean, dealToAllHolders?: boolean): void;
		/**
		 * Returns if the given cards can be added to the stack. Will return false if the shape or size of the cards does not match, or if this card is in a card holder, for example.
		 * @param {Card} cards - Card (stack) to check for adding to the stack
		*/
		canAddCards(cards: Card): boolean;
		/**
		 * Add cards to the stack. Returns whether the cards have been added successfully. Will not succeed if
		 * the shape or size of the cards does not match, or if this card is in a card holder.
		 * @param {Card} cards - Card (stack) to add to the stack
		 * @param {boolean} toFront - If true, add new cards to front of the stack. Default: false.
		 * @param {number} offset - Number of cards to skip at the back (or front when toFront is true) before adding cards. Default: 0
		 * @param {boolean} animate - If true, play card drop sound and animate the new cards flying to the stack.
		 * The animation takes some time, so the new cards aren't added to the stack instantly. If you need to react when the cards are added, you can use {@link onInserted}. Default: false.
		 * @param {boolean} flipped - If true, add the cards flipped compared to the front card of the stack. Only has an effect if all involved cards allow flipping in stacks. Default: false.
		*/
		addCards(cards: Card, toFront?: boolean, offset?: number, animate?: boolean, flipped?: boolean): boolean;
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
		 * @param {CardHolder} holder - The holder in which the objects are dropped
		 * @param {Card} removedCard - The removed card (now grabbed by the player)
		 * @param {Player} player - The player who removed the card
		*/
		onRemoved: MulticastDelegate<(holder: this, card: Card, player: Player) => void>;
		/**
		 * Called when a card is flipped on the holder by a player. The call happens
		 * immediately when the player initiates the flip and the animation starts.
		 * @param {CardHolder} holder - The holder in which the objects are dropped
		 * @param {Card} flippedCard - The flipped card
		 * @param {Player} player - The player who removed the card
		*/
		onCardFlipped: MulticastDelegate<(holder: this, card: Card, player: Player) => void>;
		/**
		 * Called when a card is rotated on the holder by a player. The call happens
		 * immediately when the player initiates the rotation and the animation starts.
		 * @param {CardHolder} holder - The holder in which the objects are dropped
		 * @param {Card} rotated - The rotated card (now grabbed by the player)
		 * @param {Player} player - The player who removed the card
		*/
		onCardRotated: MulticastDelegate<(holder: this, card: Card, player: Player) => void>;
		/**
		 * Called when the holder becomes the hand for a player.
		 * @param {CardHolder} holder - The holder that became player hand
		 * @param {Player} player - The player whose hand the holder became
		*/
		onBecameHand: MulticastDelegate<(holder: this, player: Player) => void>;
		/**
		 * Set if only the owner is allowed to take cards from the holder
		*/
		setOnlyOwnerTakesCards(onlyOwner: boolean): void;
		/**
		 * Set how hidden cards are shown on the card holder, as defined by {@link HiddenCardsType}.
		 * Setting the type to front effectively disables hiding for this holder.
		*/
		setHiddenCardsType(newType: number): void;
		/**
		 * Rotate a card on the holder (upside down). Does nothing if the card is not in the holder.
		 * @param {Card} card - The card to rotate
		*/
		rotateCard(card: Card): void;
		/**
		 * Remove a card from the holder. The removed card does not change its position.
		 * @param {number} index - The index of the card to remove
		 * @returns {Card} - The removed card
		*/
		removeAt(index: number): Card | undefined;
		/**
		 * Move a card on the holder to a new position
		 * @param {Card} card - The card to move
		 * @param {number} index - New index for the card
		*/
		moveCard(card: Card, index: number): void;
		/**
		 * Returns if a card on the holder is rotated to be upside down. Always returns false if the card is not on the holder.
		 * @param {Card} card - The card to check
		*/
		isCardUpsideDown(card: Card): boolean;
		/**
		 * Returns if the face of a card on the is visible. Always returns false if the card is not on the holder.
		 * @param {Card} card - The card to check
		*/
		isCardFaceUp(card: Card): boolean;
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
		 * Return if only the owner is allowed to take cards from the holder
		*/
		getOnlyOwnerTakesCards(): boolean;
		/**
		 * Return number of cards in the holder
		*/
		getNumCards(): number;
		/**
		 * Return how hidden cards are shown on the card holder, as defined by {@link HiddenCardsType}
		*/
		getHiddenCardsType(): number;
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
		 * (it fails if another player already occupies the chosen slot or if the slot number
		 * is invalid). Switching slots changes the player's color.
		 * @param {number} newSlot - The new player slot, between 0 and 19, or -1 to make
		 * the player a spectator
		*/
		switchSlot(newSlot: number): boolean;
		/**
		 * Show a message on the player's screen
		*/
		showMessage(message: string): void;
		/**
		 * Set the selected objects for this player. Only works for objects that can be selected in the current cursor mode:
		 * in ground mode, regular objects in the list will be ignored. In modes that don't allow selecting objects (such
		 * as drawing mode), no objects will be selected. If the player is currently holding objects, the selection will
		 * not be changed.
		*/
		setSelectedObjects(objects: GameObject[]): void;
		/**
		 * Set the player's secondary color
		*/
		setSecondaryColor(newColor: Color | [r: number, g: number, b: number, a: number]): void;
		/**
		 * Set the player's primary color
		*/
		setPrimaryColor(newColor: Color | [r: number, g: number, b: number, a: number]): void;
		/**
		 * Set the player's position. After using for a VR player, won't do anything for that
		 * player for one second to prevent making players sick.
		*/
		setPositionAndRotation(position: Vector | [x: number, y: number, z: number], rotation: Rotator | [pitch: number, yaw: number, roll: number]): void;
		/**
		 * Set the card holder that represents the hand of the player.
		 * Can only be set to a holder that is owned by this player or a holder that has no owner.
		*/
		setHandHolder(hand: CardHolder): void;
		/**
		 * Set the thickness for lines drawn by this player
		*/
		setDrawingThickness(thickness: number): void;
		/**
		 * Set the whether lines drawn by this player should be glowing
		*/
		setDrawingGlow(glow: boolean): void;
		/**
		 * Set the color in which this player is drawing lines
		*/
		setDrawingColor(color: Color | [r: number, g: number, b: number, a: number]): void;
		/**
		 * Set whether the player is blindfolded
		*/
		setBlindfolded(on: boolean): void;
		/**
		 * Send a message to the player's chat
		*/
		sendChatMessage(message: string, color: Color | [r: number, g: number, b: number, a: number]): void;
		/**
		 * Return whether the player is valid. A player becomes invalid when it drops out from the game
		*/
		isValid(): boolean;
		/**
		 * Return whether the player is using a VR headset to play.
		*/
		isUsingVR(): boolean;
		/**
		 * Returns if the player is currently a spectator
		*/
		isSpectator(): boolean;
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
		 * Returns if the player is currently a game master
		*/
		isGameMaster(): boolean;
		/**
		 * Return whether the player is currently blindfolded
		*/
		isBlindfolded(): boolean;
		/**
		 * Return the player's team (1-8). 0 means no team. To switch teams, use {@link GameWorld.setSlotTeam} for the player's slot.
		*/
		getTeam(): number;
		/**
		 * Return the player slot of this player (a number from 0 to 19, or -1
		 * if the player is a spectator). The slot determines the color of the
		 * player and what objects they own.
		*/
		getSlot(): number;
		/**
		 * Return the objects that the player has currently selected. Note that held objects always count as selected.
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
		 * Return all objects that the player owns.
		*/
		getOwnedObjects(): GameObject[];
		/**
		 * Return the player's name
		*/
		getName(): string;
		/**
		 * Return the object that the player has currently highlighted
		*/
		getHighlightedObject(): GameObject | undefined;
		/**
		 * Return the objects that the player is currently holding. A held object can be released using
		 * {@link GameObject.release}
		*/
		getHeldObjects(): GameObject[];
		/**
		 * Get the card holder that represents the hand of the player
		*/
		getHandHolder(): CardHolder | undefined;
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
		 * Return whether the snap point changes rotation of the snapped object. Use {@link getSnapRotationType} to get the exact type of rotation change
		*/
		snapsRotation(): boolean;
		/**
		 * Return whether the object is valid. A snap point becomes invalid after the object it belongs to has been destroyed
		*/
		isValid(): boolean;
		/**
		 * Get tags of this snap point. Only objects that share at least one tag will be snapped. If empty, all objects will be snapped.
		*/
		getTags(): string[];
		/**
		 * Return objects snapped to this snap point are rotated, as defined by {@link SnapPointRotationType}
		*/
		getSnapRotationType(): number;
		/**
		 * Return the relative rotation around the Z axis to which the snap point snaps (if rotation snapping is active)
		*/
		getSnapRotation(): number;
		/**
		 * Return the object that is snapped to this point. Returns undefined if no object is found.
		 * Objects are not bound to snap points when they are snapped, only their position is adjusted. Therefore, this
		 * method is not guaranteed to work correctly. It uses a line trace upwards from the snap point, and if that doesn't find
		 * anything a sphere overlap centered at the snap point. The closest object found in either of the traces is returned.
		 * @param {number} sphereRadius - Radius to use for the sphere overlap. If not specified, a quarter of the snap point range is used.
		 * * @param {bool} restrictTags - If true, only return objects that match the snap point's tags (and therefore would snap to it)
		*/
		getSnappedObject(sphereRadius?: number, restrictTags?: boolean): GameObject | undefined;
		/**
		 * Return the shape of the snap point, as defined by {@link SnapPointShape}
		*/
		getShape(): number;
		/**
		 * Return the snapping range of the snap point
		*/
		getRange(): number;
		/**
		 * Return the object to which the snap point is connected. Will return undefined if the snap point is not attached
		 * to a {@link GameObject}, but directly to the table.
		*/
		getParentObject(): StaticObject | undefined;
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
		/**
		 * Return when the snap point is valid depending on if the object it is attached to is flipped, as defined by {@link SnapPointFlipValidity}
		*/
		getFlipValidity(): number;
	}

	/**
	 * Defines which players an operation or property applies to. Can include player slots, teams, and the hosting player.
	*/
	class PlayerPermission { 
		/**
		 * The (bitmask) value that represents the permissions. Usually you don't use this value directly but manipulate it
		 * through the methods of this class.
		*/
		value: number;
		clone() : PlayerPermission;
		/**
		 * Add a player to the permission
		*/
		addPlayer(player: Player): PlayerPermission;
		/**
		 * Set whether the host is included in the permission. Does not change permissions for player slots or teams.
		*/
		setHost(hostIsPermitted: boolean): PlayerPermission;
		/**
		 * Set which player slots are included in the permission. Does not change permissions for teams or host. An empty list means an unrestricted permission for all players.
		*/
		setPlayerSlots(slots: number[]): PlayerPermission;
		/**
		 * Set which teams are included in the permission. Does not change permissions for player slots or host. An empty list means an unrestricted permission for all teams.
		*/
		setTeams(teams: number[]): PlayerPermission;
	}

	/**
	 * A line drawn by a player or created from a script
	*/
	class DrawingLine { 
		/**
		 * Positions of all points that make up the line. Relative to the position of the object that the line is attached to
		 * (global positions when the line is attached to the table).
		*/
		points: Vector[];
		/**
		 * The color of the line. Default: White
		*/
		color: Color;
		/**
		 * The thickness of the line in cm. Default: 0.5 cm
		*/
		thickness: number;
		/**
		 * Whether the start and end point of the line are rounded. Default: true
		*/
		rounded: boolean;
		/**
		 * The "up" direction for each line point. If empty, the default up direction (Z=1) is used. If
		 * there's only one element, that direction is used for all points.
		*/
		normals: Vector[];
		/**
		 * Optional tag to identify this line or provide information about it. Only used from scripting, lines created by
		 * a drawing player have an empty string as tag.
		*/
		tag: string;
		/**
		 * The emissive strength for this line. Higher values together with bright colors will cause the line to glow.
		 * A value of 0 (the default) results in no emissive, maximum is 64. The maximum value is used when a player checks
		 * the "Glow" checkbox while drawing. It corresponds to a alpha channel of 0 (completely erased) in an emissive
		 * map.
		*/
		emissiveStrength: number;
		/**
		 * Determine which players see the line. By default, it will be shown for all players.
		*/
		players: PlayerPermission;
		clone() : DrawingLine;
	}

	/**
	 * An object in the game. This class only contains methods and attributes that all objects share, whether
	 * they are interactive and physically simulated or not. For most purposes, the derived class {@link GameObject}
	 * is used. Static objects are used when interacting with tables from scripts.
	*/
	class StaticObject { 
		/**
		 * Called when another object is snapped to a snap point on this object. This event is triggered for the object with the target snap point, see {@link GameObject.onSnapped} for an event on the object that snaps.
		 * @param {GameObject} object - The object being released
		 * @param {Player} player - The player that released the object
		 * @param {SnapPoint} snapPoint - The point that the object is moved to
		 * @param {Vector} grabPosition - The position where the released object was when it was grabbed. Zero if it hasn't been grabbed (for example when it was dragged from the object library)
		 * @param {Rotator} grabRotation - The rotation the released object had when it was grabbed.
		*/
		onSnappedTo: MulticastDelegate<(object: GameObject, player: Player, snapPoint: SnapPoint, grabPosition: Vector | [x: number, y: number, z: number], grabRotation: Rotator | [pitch: number, yaw: number, roll: number]) => void>;
		/**
		 * Transform a world rotation to an object rotation
		 * @param {Rotator} rotation - The rotation in world space to transform to relative to the object
		*/
		worldRotationToLocal(rotation: Rotator | [pitch: number, yaw: number, roll: number]): Rotator;
		/**
		 * Transform a world position to an object position
		 * @param {Vector} position - The position in world space to transform to relative to the object
		*/
		worldPositionToLocal(position: Vector | [x: number, y: number, z: number]): Vector;
		/**
		 * Update an attached UI element. Will not do anything if called with a UI element that is not attached to
		 * the object. You need to call this method after modifying values in a ``UIElement``. Does not work if
		 * you change the {@link UIElement.widget} property, you have to use {@link setUI} in this case.
		 * @param {UIElement} - The UI element to be updated
		*/
		updateUI(element: UIElement): void;
		/**
		 * Return a Json string representing the object. Can be used to spawn copies.
		*/
		toJSONString(): string;
		/**
		 * Replace an attached UI element. Will not do anything if called with an index that doesn't have a UI element.
		 * @param {number} - The index of the UI element to replace
		 * @param {UIElement} - The UI element to be stored at the index
		*/
		setUI(index: number, element: UIElement): void;
		/**
		 * Set the list of tags for the object.
		*/
		setTags(tags: string[]): void;
		/**
		 * Set surface type.  Only affects sound effects when colliding with other objects.
		 * @param {string} - The new surface type.
		*/
		setSurfaceType(surfaceType: string): void;
		/**
		 * Set the object's secondary color
		 * @param {Color} color - The new secondary color
		*/
		setSecondaryColor(color: Color | [r: number, g: number, b: number, a: number]): void;
		/**
		 * Set the object's script. The script will be executed immediately.
		 * @param {string} filename - The filename of the script. Pass an empty string to remove the current script.
		 * @param {string} packageId - The id of the package that contains the script file (in the
		 * Scripts folder). Can usually be empty when used from scripts to use the same package
		 * that contains the script file, but you need to explicitly pass {@link refPackageId} for
		 * the current package or a package id when you use it in a callback. You can find package
		 * ids in the manifest.json file in package folders. Usually you won't use this parameter,
		 * unless you have a specific reason to set a script from a different package than where
		 * the calling script is located.
		*/
		setScript(filename: string, packageId?: string): void;
		/**
		 * Set the object's scale instantly
		 * @param {Vector} scale - The new scale
		*/
		setScale(scale: Vector | [x: number, y: number, z: number]): void;
		/**
		 * Set the data that will be stored in save game states. The data is available using {@link getSavedData} when the object
		 * script is run after loading a save state. Try to keep this data small and don't change it frequently, it needs to
		 * be sent over the network to all clients. A similar method exists for global saved data: {@link GameWorld.setSavedData}. <br>
		 * If you want to use custom data that is not a string, you can encode it to JSON using `JSON.stringify()`, and then
		 * decode what you get from {@link getSavedData} using `JSON.parse()`.
		 * @param {string} data - Data to store, maximum length 1023 characters
		*/
		setSavedData(data: string, key: string): void;
		/**
		 * Set the object's roughness value. Lower roughness makes the object more shiny.
		 * @param {number} roughness - The new roughness value, from 0 to 1
		*/
		setRoughness(roughness: number): void;
		/**
		 * Set the object's rotation. Optionally show an animation of the object rotating toward the new orientation.
		 * The animation is only visual, the physical rotation of the object is changed instantly.
		 * Does not have an effect if a player is currently holding the object.
		 * @param {Rotator} rotation - The new rotation
		 * @param {number} animationSpeed - If larger than 0, show animation. A value of 1 gives a reasonable, quick animation. Value range clamped to [0.1, 5.0]. Default: 0
		*/
		setRotation(rotation: Rotator | [pitch: number, yaw: number, roll: number], animationSpeed?: number): void;
		/**
		 * Set the object's primary color
		 * @param {Color} color - The new primary color
		*/
		setPrimaryColor(color: Color | [r: number, g: number, b: number, a: number]): void;
		/**
		 * Set the object's position. Optionally show an animation of the object flying toward the new location.
		 * The animation is only visual, the physical location of the object is changed instantly.
		 * Does not have an effect if a player is currently holding the object.
		 * @param {Vector} position - The new position
		 * @param {number} animationSpeed - If larger than 0, show animation. A value of 1 gives a reasonable, quick animation. Value range clamped to [0.1, 5.0]. Default: 0
		*/
		setPosition(position: Vector | [x: number, y: number, z: number], animationSpeed?: number): void;
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
		 * Set the object's unique id. Returns whether the id was changed successfully.
		 * Fails if the id is already used by another object.
		 * @param {string} id - The new unique id
		*/
		setId(iD: string): boolean;
		/**
		 * Set the object's friction value
		 * @param {number} friction - The new friction value, from 0 to 1
		*/
		setFriction(friction: number): void;
		/**
		 * Set the object's description
		 * @param {string} description - The new object description. Maximum length is 2000 characters. You can use the same BBCode tags as
		 * in the in-game notes or the {@link RichText} widget.
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
		 * Remove an attached UI element. Does not have any effect if the passed UI element is not attached to the object.
		 * @param {UIElement} - The UI element to be removed
		*/
		removeUIElement(element: UIElement): void;
		/**
		 * Remove attached UI element at the given index.
		 * @param {index} index - The index of the UI element to remove
		*/
		removeUI(index: number): void;
		/**
		 * Remove a drawn line from the object.
		*/
		removeDrawingLineObject(line: DrawingLine): void;
		/**
		 * Remove the drawn line at the given index from the object
		*/
		removeDrawingLine(index: number): void;
		/**
		 * Transform an object rotation to a world rotation
		 * @param {Rotator} rotation - The rotation relative to the object center to transform to world space
		*/
		localRotationToWorld(rotation: Rotator | [pitch: number, yaw: number, roll: number]): Rotator;
		/**
		 * Transform an object position to a world position
		 * @param {Vector} position - The position relative to the object center to transform to world space
		*/
		localPositionToWorld(position: Vector | [x: number, y: number, z: number]): Vector;
		/**
		 * Return whether the object is valid. An object becomes invalid after it has been destroyed
		*/
		isValid(): boolean;
		/**
		 * Get an array of all attached UI elements. Modifying the array won't change
		 * the actual UIs, use {@link updateUI} or {@link setUI} to update.
		*/
		getUIs(): UIElement[];
		/**
		 * Return the name of the object's template
		*/
		getTemplateName(): string;
		/**
		 * Return the metadata of the object's template (set in the editor). Can contain JSON encoded information.
		*/
		getTemplateMetadata(): string;
		/**
		 * Return the object's template id
		*/
		getTemplateId(): string;
		/**
		 * Return the current list of tags for the object.
		*/
		getTags(): string[];
		/**
		 * Return surface type. Only affects sound effects when colliding with other objects.
		*/
		getSurfaceType(): string;
		/**
		 * Return a snap point of the object
		 * @param {number} index - Index of the snap point
		*/
		getSnapPoint(index: number): SnapPoint | undefined;
		/**
		 * Get the size of the object in cm. This is the same size that is shown in the editor and the coordinates window, it doesn't change when the object is rotated.
		 * If you are looking to calculate the borders of the object, use {@link getExtent} instead.
		*/
		getSize(): Vector;
		/**
		 * Return the object's secondary color
		*/
		getSecondaryColor(): Color;
		/**
		 * Return the package id of the object's script. Returns an empty string if no script is set for the object.
		*/
		getScriptPackageId(): string;
		/**
		 * Return the filename of the object's script. Returns an empty string if no script is set for the object.
		*/
		getScriptFilename(): string;
		/**
		 * Return the object's scale
		*/
		getScale(): Vector;
		/**
		 * Return data that was stored using {@link setSavedData} or loaded from a saved state.
		*/
		getSavedData(key: string): string;
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
		 * Return the object's user visible name
		*/
		getName(): string;
		/**
		 * Return the object's metallic value.
		*/
		getMetallic(): number;
		/**
		 * Return the object's unique id
		*/
		getId(): string;
		/**
		 * Return the object's friction value
		*/
		getFriction(): number;
		/**
		 * Get the center of the object extent: an axis-aligned bounding box encompassing the object.
		 * This will often be the same position as returned by {@link getPosition}, but will differ for objects with their physical center not at their volume center.
		 * @param {boolean} currentRotation - If true, return the extent of an axis-aligned bounding box around the object at its current rotation. If false, return for the default rotation.
		 * * @param {boolean} includeGeometry - Determines whether visible geometry is included in the extent. If false, only colliders are used when determining the extent.
		*/
		getExtentCenter(currentRotation: boolean, includeGeometry: boolean): Vector;
		/**
		 * Get the object extent: half-size of an axis-aligned bounding box encompassing the object.
		 * Adding this vector to the position returned by {@link getExtentCenter} gives a corner of the bounding box.
		 * @param {boolean} currentRotation - If true, return the extent of an axis-aligned bounding box around the object at its current rotation. If false, return for the default rotation.
		 * @param {boolean} includeGeometry - Determines whether visible geometry is included in the extent. If false, only colliders are used when determining the extent.
		*/
		getExtent(currentRotation: boolean, includeGeometry: boolean): Vector;
		/**
		 * Used when executing an object script to determine why it was executed. Possible return values:<br>
		 * "Create" - The object was newly created, for example from the object library or through copy and paste<br>
		 * "ScriptReload" - The script was reloaded, for example because it was set on the object for the first time, or because the scripting environment was reset<br>
		 * "StateLoad" - A game state that contained the object was loaded
		*/
		static getExecutionReason(): string;
		/**
		 * Return all drawing lines on the object.
		*/
		getDrawingLines(): DrawingLine[];
		/**
		 * Return the object's description
		*/
		getDescription(): string;
		/**
		 * Return the object's density value
		*/
		getDensity(): number;
		/**
		 * Return the object's bounciness value
		*/
		getBounciness(): number;
		/**
		 * @deprecated alias for {@getUIs}
		*/
		getAttachedUIs(): UIElement[];
		/**
		 * Return an array with all snap points of the object
		*/
		getAllSnapPoints(): SnapPoint[];
		/**
		 * Destroy the object
		*/
		destroy(): void;
		/**
		 * @deprecated alias for {@link addUI}
		 * @param {UIElement} element - The UI element to attach
		 * @returns {number} - The index of the attached UI element
		*/
		attachUI(element: UIElement): number;
		/**
		 * Attach a new UI element object to this object.
		 * @param {UIElement} element - The UI element to attach
		 * @returns {number} - The index of the attached UI element
		*/
		addUI(element: UIElement): number;
		/**
		 * Add a drawn line to the object. Lines are geometry and can increase the size of the object returned by
		 * {@link getSize} and {@link getExtent}.
		 * Returns whether the line was added successfully. It can't be added if no table exists,
		 * if the {@link DrawingLine} is invalid, or if there are already too many lines drawn on
		 * the table and the new line would go beyond the limit.
		*/
		addDrawingLine(line: DrawingLine): boolean;
	}

	/**
	 * Represents a switcher object that allows players to switch between different objects.
	 * Created using {@link GameObject.createSwitcher} and accessed using {@link GameObject.getSwitcher}
	*/
	class Switcher { 
		/**
		 * Called when the active object has changed
		 * @param {Switcher} switcher - The switcher for which the change happened
		 * @param {number} newIndex - The new active index
		 * @param {number} oldIndex - The previous active index. Can be equal to new index if an object was deleted
		 * from the switcher and the object at this index changed, or if a player switches to a random state which
		 * turns out to be the same state as before.
		*/
		onObjectSwitched: MulticastDelegate<(switcher: this, newIndex: number, oldIndex: number) => void>;
		/**
		 * Set the index of the active object
		*/
		setObjectIndex(index: number): void;
		/**
		 * Remove an object from the switcher and delete it. Returns whether something was removed.
		 * @param {number} index - The index of the object to remove
		*/
		removeAt(index: number): boolean;
		/**
		 * Remove an object from the switcher and delete it. Only deletes the object if it was in the switcher, and returns whether it was deleted.
		 * @param {objectToRemove} GameObject - The object to remove
		*/
		remove(objectToRemove: GameObject): boolean;
		/**
		 * Return whether the switcher object is valid. A switcher becomes invalid after it has been destroyed explicitly,
		 * or if the current object is deleted.
		*/
		isValid(): boolean;
		/**
		 * Return the object at a given index
		*/
		getObjectAt(index: number): GameObject;
		/**
		 * Return the number of objects in the switcher
		*/
		getNumObjects(): number;
		/**
		 * Return the index of the currently active object
		*/
		getCurrentObjectIndex(): number;
		/**
		 * Return currently active object
		*/
		getCurrentObject(): GameObject;
		/**
		 * Remove this switcher, leaving the active object as a regular object
		*/
		destroy(): void;
		/**
		 * Check whether an object is in this container
		*/
		contains(checkObject: GameObject): boolean;
		/**
		 * Add an array of objects to the switcher. If objects are in a container, card holder, or another switcher, they will not be added.
		 * @param {GameObject[]} objects - Objects to add
		 * @param {number} index - The index at which the new objects will be added. By default, they will be inserted at start (index 0)
		 * @param {boolean} showAnimation - If false, don't show insert animation. Default: false
		*/
		addObjects(objects: GameObject[], index?: number, showAnimation?: boolean): void;
	}

	/**
	 * A container that can hold other objects
	*/
	class Container extends GameObject { 
		/**
		 * Called after objects are dropped into the container by a player
		 * @param {Container} container - The container in which the objects are dropped
		 * @param {GameObject[]} object - The newly inserted objects
		 * @param {Player} player - The player who dropped the objects
		*/
		onInserted: MulticastDelegate<(container: this, insertedObjects: GameObject[], player: Player) => void>;
		/**
		 * Called after an object is dragged from the container by a player
		 * @param {Container} container - The container from which the object is removed
		 * @param {GameObject} object - The removed object (now grabbed by the player)
		 * @param {Player} player - The player who removed the object
		*/
		onRemoved: MulticastDelegate<(container: this, removedObject: GameObject, player: Player) => void>;
		/**
		 * Remove an item from the container, move it to the provided position, and return it.
		 * Note that the item will be removed from the container even for infinite containers (unless the ``dontRemove`` parameter
		 * is set).
		 * @param {number} index - The index of the object to take
		 * @param {Vector} position - The position where the item should appear
		 * @param {boolean} showAnimation - If false, don't show take animation and don't play sound. Default: false
		 * @param {boolean} keep - If true, keep a copy of the item in the container. Default: false
		*/
		takeAt(index: number, position: Vector | [x: number, y: number, z: number], showAnimation?: boolean, keep?: boolean): GameObject | undefined;
		/**
		 * Take an item from the container, move it to the provided position, and return whether it was taken successfully.
		 * Note that the item will be removed from the container even for infinite containers (unless the ``dontRemove`` parameter
		 * is set).
		 * @param {objectToRemove} GameObject - The object to remove
		 * @param {Vector} position - The position where the item should appear
		 * @param {boolean} showAnimation - If false, don't show take animation and don't play sound. Default: false
		 * @param {boolean} keep - If true, keep a copy of the item in the container. Default: false
		*/
		take(objectToRemove: GameObject, position: Vector | [x: number, y: number, z: number], showAnimation?: boolean, keep?: boolean): boolean;
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
		 * Set the maximum number of contained objects. Currently contained objects stay in the container
		 * even if the new maximum is lower than the current count.
		 * @param {number} maxItems - The new maximum. Must be between 1 and 500.
		*/
		setMaxItems(maxItems: number): void;
		/**
		 * Set the current list of container tags. If container tags exist, objects need to share at least one of
		 * them in their own tag list or players won't be able to insert them. Inserting from scripts is not affected.
		*/
		setContainerTags(tags: string[]): void;
		/**
		 * Remove an item from the container and delete it. Returns whether something was removed.
		 * @param {number} index - The index of the object to remove
		*/
		removeAt(index: number): boolean;
		/**
		 * Remove an item from the container and delete it. Only deletes the item if it was in the container, and returns whether it was deleted.
		 * @param {objectToRemove} GameObject - The object to remove
		*/
		remove(objectToRemove: GameObject): boolean;
		/**
		 * Alias for {@link addObjects}
		*/
		insert(objects: GameObject[], index?: number, showAnimation?: boolean): void;
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
		 * Return the index that would get picked next if a player would take an object from the container.
		 * Depends on the type set by {@link setType}, for example for type 1 or 2 (random/infinite) it will
		 * be a random number between 0 and {@link getMaxItems} - 1, for type 2 (queue) it will always be 0.
		 * Returns -1 if the container is empty or this object is invalid. Note that if a player actually takes
		 * an item from a random container, they can get a different index than a previous call to this method,
		 * because a different random number can be drawn.
		*/
		getNextTakeIndex(): number;
		/**
		 * Return the current maximum number of contained objects
		*/
		getMaxItems(): number;
		/**
		 * Return contained objects. Manipulating objects in the array changes the object in the container, but manipulating the array
		 * (e.g. removing or adding objects) does not change the contents of the container!
		*/
		getItems(): GameObject[];
		/**
		 * Return the current list of container tags. If container tags exist, objects need to share at least one of
		 * them in their own tag list or players won't be able to insert them. Inserting from scripts is not affected.
		*/
		getContainerTags(): string[];
		/**
		 * Check whether an object is in this container
		*/
		contains(checkObject: GameObject): boolean;
		/**
		 * Remove all contained objects
		*/
		clear(): void;
		/**
		 * Add an array of objects into the container. If objects are in another container,
		 * they are removed from their current container before inserting.
		 * @param {GameObject[]} objects - Objects to insert
		 * @param {number} index - The index at which the new objects will be inserted. By default, they will be inserted at start (index 0)
		 * @param {boolean} showAnimation - If false, don't show insert animation and don't play sound. Default: false
		*/
		addObjects(objects: GameObject[], index?: number, showAnimation?: boolean): void;
	}

	/**
	 * An object in the game that players can interact with
	*/
	class GameObject extends StaticObject { 
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
		 * @param {number} seconds - Duration of the previous tick
		*/
		onTick: MulticastDelegate<(object: this, deltaTime: number) => void>;
		/**
		 * Called when the object is picked up
		 * @param {GameObject} object - The object being grabbed
		 * @param {Player} player - The player that grabbed the object
		*/
		onGrab: MulticastDelegate<(object: this, player: Player) => void>;
		/**
		 * Called when the object is released (but not reset). When the object is snapped, {@link onSnapped} or {@link onSnappedToGrid} are called in addition.
		 * @param {GameObject} object - The object being released
		 * @param {Player} player - The player that released the object
		 * @param {boolean} thrown - True if the object was thrown (released above a threshold velocity) instead of being dropped
		 * @param {Vector} grabPosition - The position where this object was when it was grabbed. Zero if it hasn't been grabbed (for example when it was dragged from the object library).
		 * @param {Rotator} grabRotation - The rotation this object had when it was grabbed.
		*/
		onReleased: MulticastDelegate<(object: this, player: Player, thrown: boolean, grabPosition: Vector | [x: number, y: number, z: number], grabRotation: Rotator | [pitch: number, yaw: number, roll: number]) => void>;
		/**
		 * Called when the object is snapped to a snap point on releasing. Not called when snapping to the global grid, in that case {@link onSnappedToGrid} is called instead.
		 * @param {GameObject} object - The object being released
		 * @param {Player} player - The player that released the object
		 * @param {SnapPoint} snapPoint - The point that the object is moved to
		 * @param {Vector} grabPosition - The position where this object was when it was grabbed. Zero if it hasn't been grabbed (for example when it was dragged from the object library)
		 * @param {Rotator} grabRotation - The rotation this object had when it was grabbed.
		*/
		onSnapped: MulticastDelegate<(object: this, player: Player, snapPoint: SnapPoint, grabPosition: Vector | [x: number, y: number, z: number], grabRotation: Rotator | [pitch: number, yaw: number, roll: number]) => void>;
		/**
		 * Called on releasing an object when the object is snapped to the global grid or because of the "Always Snap" setting in the session options.
		 * @param {GameObject} object - The object being released
		 * @param {Player} player - The player that released the object
		 * @param {Vector} grabPosition - The position where this object was when it was grabbed. Zero if it hasn't been grabbed (for example when it was dragged from the object library)
		 * @param {Rotator} grabRotation - The rotation this object had when it was grabbed.
		*/
		onSnappedToGrid: MulticastDelegate<(object: this, player: Player, grabPosition: Vector | [x: number, y: number, z: number], grabRotation: Rotator | [pitch: number, yaw: number, roll: number]) => void>;
		/**
		 * Called when the object is reset to its position before being picked up.
		 * @param {GameObject} object - The object being reset
		 * @param {Player} player - The player that reset the object
		*/
		onReset: MulticastDelegate<(object: this, player: Player) => void>;
		/**
		 * Called when the flip/upright action is executed on the object. This can happen while held or when a user presses the flip/upright button while the object is selected or highlighted.
		 * The event is triggered immediately when the action starts, so the object will not have flipped yet.
		 * @param {GameObject} object - The object being flipped
		 * @param {Player} player - The player that flipped the object
		*/
		onFlipUpright: MulticastDelegate<(object: this, player: Player) => void>;
		/**
		 * Called when the object is hit by another object or hits another object. Gets called for both objects involved in a collision. Only called for collisions that cause an impact sound to be played.
		 * @param {GameObject} object - The first object in the collision
		 * @param {GameObject} otherObject - The second object in the collision. Can be undefined if an object collides with scenery.
		 * @param {boolean} first - True if this call is the first of the two calls made for each collision. Check this parameter if you only want to react once to a collision but both colliding objects can have the onHit event defined.
		 * @param {Vector} impactPoint - The position at which the two objects collided
		 * @param {Vector} impulse - Direction and magnitude of the impulse generated by the collision on the first object. Invert to get impulse on the second object.
		*/
		onHit: MulticastDelegate<(object: this, otherObject: GameObject | undefined, first: boolean, impactPoint: Vector | [x: number, y: number, z: number], impulse: Vector | [x: number, y: number, z: number]) => void>;
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
		 * Called when a player executes a number action on the object (by highlighting or selecting it and pressing number keys).
		 * Will be called even if the object has a defined behavior for number actions (like dice or multistate objects), after
		 * any object defined behavior.
		 * @param {GameObject} object - The object on which the action is executed
		 * @param {Player} player - The player that executed the action
		 * @param {number} number - The number pressed by the player
		*/
		onNumberAction: MulticastDelegate<(object: this, player: Player, number: number) => void>;
		/**
		 * Called when a custom action defined through {@link addCustomAction} is executed.
		 * @param {GameObject} object - The object on which the action is executed
		 * @param {Player} player - The player that executed the action
		 * @param {string} identifier - The identifier of the executed action
		*/
		onCustomAction: MulticastDelegate<(object: this, player: Player, identifier: string) => void>;
		/**
		 * Called when the object comes to rest. For ground objects or when the session is set to locked physics, the object
		 * has been locked right before this event is triggered.
		*/
		onMovementStopped: MulticastDelegate<(object: this) => void>;
		/**
		 * Immediately freeze the object and set its type to ground if it is currently not a ground object.
		 * Set its type to regular if it is currently a ground object. If you want to completely lock an object
		 * and not allow players to interact with it, use {@link setObjectType} with
		 * {@link ObjectType.NonInteractive} instead.
		*/
		toggleLock(): void;
		/**
		 * Switch lights on this object on or off
		*/
		switchLights(on: boolean): void;
		/**
		 * Snap the object to the ground below it.
		*/
		snapToGround(): void;
		/**
		 * Snap the object as if it was dropped at its current position. Does nothing if no snap point is in range below the object.
		 * Snapping in this way does not trigger the onSnapped callback. Returns the snapped point if the object was snapped.
		 * Optionally show an animation of the object rotating toward the new orientation.
		 * The animation is only visual, the physical rotation of the object is changed instantly.
		 * Does not have an effect if a player is currently holding the object.
		 * @param {number} animationSpeed - If larger than 0, show animation. A value of 1 gives a reasonable, quick animation. Value range clamped to [0.1, 5.0]. Default: 0
		*/
		snap(animationSpeed?: number): SnapPoint | undefined;
		/**
		 * Set whether the object is allowed to snap
		 * @param {boolean} allowed - Whether snapping will be allowed
		*/
		setSnappingAllowed(allowed: boolean): void;
		/**
		 * Set the player slot that owns the object. Set to -1 to remove owner.
		 * @param {number} slot - The new owning player slot
		*/
		setOwningPlayerSlot(slot: number): void;
		/**
		 * Set the object's type. Available options are defined in {@link ObjectType}.
		 * @param {number} type - The new object type
		*/
		setObjectType(type: number): void;
		/**
		 * Set the object's linear velocity in cm/second.
		 * Note that setting velocity directly can lead make the physics simulation unstable, you should prefer to apply impulse or force to the object.
		 * @param {Vector} velocity - The new velocity
		*/
		setLinearVelocity(velocity: Vector | [x: number, y: number, z: number]): void;
		/**
		 * Set the object's group id. Objects with the same group id are always picked up together.
		 * @param {number} groupId - The new group id. Set to -1 to remove the object from all groups.
		*/
		setGroupId(groupId: number): void;
		/**
		 * Set the object's angular (rotational) velocity in degrees/second.
		 * Note that setting velocity directly can lead make the physics simulation unstable, you should prefer to apply impulse, torque, or force to the object.
		 * @param {Rotator} velocity - The new angular velocity
		*/
		setAngularVelocity(velocity: Rotator | [pitch: number, yaw: number, roll: number]): void;
		/**
		 * Remove a custom action by identifier or name.
		 * @param {string} identifier - The identifier or name of the action to remove
		*/
		removeCustomAction(identifier: string): void;
		/**
		 * Ensure that no player is holding this object. If any player is currently holding the object, it will fall down.
		 * Some GameObject methods (like setting position or applying physical force) don't have an effect or do not work
		 * properly while a player is holding the object.
		*/
		release(): void;
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
		 * Return if the object is currently held by a player
		*/
		isHeld(): boolean;
		/**
		 * Get the switcher that contains this object. Returns undefined if the object is not part of a switcher
		*/
		getSwitcher(): Switcher | undefined;
		/**
		 * Return the snap point that the object is snapped to (or more precisely, the snap point that the object would
		 * snap to if it was snapped now). Return undefined if the object is not snapped to any points.
		 * Objects are not bound to snap points when they are snapped, only their position is adjusted. Therefore, this
		 * method is not guaranteed to work correctly. It uses the same mechanism that regular snapping uses to determine
		 * where an object should snap. This could fail for snap points that are high above a surface: the object may have
		 * fallen or snapped too far below the snap point.
		*/
		getSnappedToPoint(): SnapPoint | undefined;
		/**
		 * Return the player slot that owns the object. Returns -1 for holders without owner.
		*/
		getOwningPlayerSlot(): number;
		/**
		 * Return the player slot that owns the object. Returns undefined for objects without owner.
		*/
		getOwningPlayer(): Player | undefined;
		/**
		 * Get the object's type. Possible values are defined in {@link ObjectType}.
		*/
		getObjectType(): number;
		/**
		 * Return the object's mass in kg
		*/
		getMass(): number;
		/**
		 * Return the object's linear velocity in cm/s
		*/
		getLinearVelocity(): Vector;
		/**
		 * Return the object's group id. Objects with the same group id are always picked up together.
		 * Returns -1 if the object is not part of a group.
		*/
		getGroupId(): number;
		/**
		 * Returned the container that this object is in. Return undefined if the object is not in a container.
		*/
		getContainer(): Container | undefined;
		/**
		 * Return the object's center of mass
		*/
		getCenterOfMass(): Vector;
		/**
		 * Return the object's angular (rotational) velocity in degrees/s
		*/
		getAngularVelocity(): Rotator;
		/**
		 * Immediately freeze the object and set its type to ground if it is currently not a ground object.
		*/
		freeze(): void;
		/**
		 * Flip the object or rotate it to its default orientation, depending on the object. Uses animation and physics.
		 * Calling this does the same thing as a player pressing the flip/upright key for highlighted or selected objects.
		 * Cards in holders are also flipped, but held objects are not affected.
		*/
		flipOrUpright(): void;
		/**
		 * Create and return a new switcher with this object as the first (and active) state
		 * @param {GameObject[]} objects - The other objects to include in the switcher. At least one element is needed
		 * because switchers are only valid with at least two objects.
		 * @param {bool} - Whether to animate additional objects flying into first object. Default: false
		*/
		createSwitcher(objects: GameObject[], showAnimation?: boolean): Switcher;
		/**
		 * Return whether lights on this object are switched on
		*/
		areLightsOn(): boolean;
		/**
		 * Apply a torque to the object. Works like a "thruster" and should be called every tick for the duration of the torque.
		 * @param {Vector} torque - The axis of rotation and magnitude of the torque to apply in kg*cm^2/s^2.
		 * @param {boolean} useMass - If false (default), ignore the mass of the object and apply the force directly as change of angular acceleration in cm^2/s^2.
		*/
		applyTorque(torque: Vector | [x: number, y: number, z: number], useMass?: boolean): void;
		/**
		 * Apply an impulse to the object. Works as an instant change of velocity.
		 * @param {Vector} impulse - The direction and magnitude of the impulse to apply in kg*cm/s
		 * @param {number} position - The position where to apply the impulse, relative to the object origin. If this is not equal to the center of mass, the force will create angular velocity.
		*/
		applyImpulseAtPosition(impulse: Vector | [x: number, y: number, z: number], position: Vector | [x: number, y: number, z: number]): void;
		/**
		 * Apply an impulse to the object. Works as an instant change of velocity.
		 * @param {Vector} impulse - The direction and magnitude of the impulse to apply in kg*cm/s.
		 * @param {boolean} useMass - If false (default), ignore the mass of the object and apply the impulse directly as change of velocity in cm/s.
		*/
		applyImpulse(impulse: Vector | [x: number, y: number, z: number], useMass?: boolean): void;
		/**
		 * Apply a force to the object. Works like a "thruster" and should be called every tick for the duration of the force.
		 * @param {Vector} force - The direction and magnitude of the force to apply in kg*cm\s^2.
		 * @param {Vector} position - The position where to apply the force, relative to the object origin. If this is not equal to the center of mass, the force will create angular acceleration.
		*/
		applyForceAtPosition(force: Vector | [x: number, y: number, z: number], position: Vector | [x: number, y: number, z: number]): void;
		/**
		 * Apply a force to the object. Works like a "thruster" and should be called every tick for the duration of the force.
		 * @param {Vector} force - The direction and magnitude of the force to apply in kg*cm/s^2.
		 * @param {boolean} useMass - If false (default), ignore the mass of the object and apply the force directly as change of acceleration in cm/s^2.
		*/
		applyForce(force: Vector | [x: number, y: number, z: number], useMass?: boolean): void;
		/**
		 * Apply a torque to the object. Works as an instant change of angular velocity.
		 * @param {Vector} impulse - The axis of rotation and magnitude of the impulse to apply in kg*cm^2/s.
		 * @param {boolean} useMass - If false (default), ignore the mass of the object and apply the force directly as change of angular velocity in cm^2/s.
		*/
		applyAngularImpulse(impulse: Vector | [x: number, y: number, z: number], useMass?: boolean): void;
		/**
		 * Add a custom action that appears in the context menu of the object.
		 * @param {string} name - The name for the action in the context menu
		 * @param {string} tooltip - The tooltip text to show for the custom action
		 * @param {string} identifier - An identifier passed to the onCustomAction event if you don't want to use the action
		 * name to identify what action is executed. If empty, the action name is used as identifier.
		*/
		addCustomAction(name: string, tooltip?: string, identifier?: string): void;
	}

	/**
	 * Base class for UI elements. Doesn't have functionality by itself, use subclasses instead.
	*/
	class Widget { 
		/**
		 * Set whether the widget is visible. When a widget that contains other widgets (like {@link VerticalBox}) is
		 * invisible, all its children are invisible, too. The layout of widgets is updated when visibility changes,
		 * and invisible widgets are treated as if they don't exist.
		 * @param {boolean} visible - Whether the widget is visible.
		*/
		setVisible(visible: boolean): Widget;
		/**
		 * Set whether the widget is enabled. When a widget is disabled, users can't interact with it and it is greyed
		 * out. When a widget that contains other widgets (like {@link VerticalBox}) is disabled, all its children
		 * behave as if disabled, too. By default, widgets are enabled.
		 * @param {boolean} enabled - Whether to enable the widget.
		*/
		setEnabled(enabled: boolean): this;
		/**
		 * Return whether the widget is currently visible (see {@link setVisible}).
		*/
		isVisible(): boolean;
		/**
		 * Return whether the widget is currently enabled (see {@link setEnabled}).
		*/
		isEnabled(): boolean;
		/**
		 * Return the widget that contains this widget, for example a border that wraps a check box.
		 * Returns undefined if this object has no parent.
		*/
		getParent(): Widget | undefined;
		/**
		 * Return the game object that this UI element is attached to.
		 * Returns undefined if the element isn't attached to a game object.
		*/
		getOwningObject(): GameObject | undefined;
	}

	/**
	 * Represents a UI element in the game world. Can be attached to an object using {@link GameObject.addUI} or
	 * directly added to the world with {@link GameWorld.addUI}. If you want to modify values of the UI element,
	 * after adding it, for example to modify its location, you need to call {@link GameObject.updateUI} (or
	 * {@link GameWorld.updateUI}) afterwards to apply the update.<br>
	 * You can't modify the {@link widget} property as an update, but you can change properties of the widget
	 * without needing to call updateUI.<br>
	 * If you have multiple widgets on the same plane, it is usually easier and faster to use one UI element
	 * with a {@link Canvas} widget instead of one UI element for each widget.
	*/
	class UIElement { 
		/**
		 * The main widget of this component
		*/
		widget: Widget;
		/**
		 * The position of the UI element. Relative to the object center when attached to an object.
		*/
		position: Vector;
		/**
		 * The rotation for this component. Relative to the object rotation when attached to an object.
		 * On the default zero rotation, the UI is facing upwards.
		*/
		rotation: Rotator;
		/**
		 * The scale of this component. At scale 1, one pixel of width or height corresponds to one millimeter.
		 * Relative to the object scale when attached to an object. Default: 1
		*/
		scale: number;
		/**
		 * If true, use the natural size of the UI instead of the specified width and height. Default: true
		*/
		useWidgetSize: boolean;
		/**
		 * Width in pixels to use for rendering the UI. Only used when {@link useWidgetSize} is false. Default: 160
		*/
		width: number;
		/**
		 * Height in pixels to use for rendering the UI. Only used when {@link useWidgetSize} is false. Default: 90
		*/
		height: number;
		/**
		 * If true, use the alpha channel of widget colors to allow for partly transparent UIs. If false, use alpha
		 * as a mask instead: low alpha values are invisible, high alpha values are completely opaque.
		 * Default: false
		*/
		useTransparency: boolean;
		/**
		 * The horizontal anchor point of the UI. Determines where {@link position} is in relation to the UI:
		 * for 0 it is at the left side, 0.5 is at the center, 1.0 is the right side. Default: 0.5
		*/
		anchorX: number;
		/**
		 * The vertical anchor point of the UI. Determines where {@link position} is in relation to the UI:
		 * for 0 it is at the top, 0.5 is at the center, 1.0 is the bottom. Default: 0.5
		*/
		anchorY: number;
		/**
		 * Determines how the UI is presented to the player, as defined by {@link UIPresentationStyle}.
		*/
		presentationStyle: number;
		/**
		 * If true, show the UI from both the front and the back. It will be mirrored when seen from the back!
		 * If false, the UI is invisible from the back. Default: false
		*/
		twoSided: boolean;
		/**
		 * Determine which players see the UI. By default, it will be shown for all players.
		*/
		players: PlayerPermission;
		/**
		 * Determine whether to the UI casts a shadow. Default: true
		*/
		castShadow: boolean;
		/**
		 * Determines visibility of the UI for regular and zoomed object state, as defined by {@link UIZoomVisibility}.
		 * If {@link presentationStyle} is equal to {@link UIPresentationStyle.Screen}, it will fall back
		 * to {@link UIPresentationStyle.ViewAligned} while zoomed.
		*/
		zoomVisibility: number;
		clone() : UIElement;
	}

	/**
	 * Phase Details
	*/
	class PhaseDetails { 
		/**
		 * Name of the phase. Can't be empty for a valid phase.
		*/
		name: string;
		/**
		 * Configured active player slots for the phase. Relevant when {@link takeTurns} or {@link restrictInteraction} is true.
		*/
		playerSlots: number[];
		/**
		 * Whether active players in this phase take turns. If false, there are no turns within the phase.
		*/
		takeTurns: boolean;
		/**
		 * Whether players that are not active in the phase are prevented from interacting with objects.
		*/
		restrictInteraction: boolean;
		clone() : PhaseDetails;
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
	 * Represents a UI element on the screen. Can be added to the screen using {@link GameWorld.addScreenUI}.
	 * If you want to modify values of the UI element after adding it, for example to modify its location,
	 * you need to call {@link GameWorld.updateScreenUI} afterwards to apply the update.<br>
	 * You can't modify the {@link widget} property as an update, but you can change properties of the widget
	 * without needing to call updateScreenUI.<br>
	 * Screen UI elements are not visible for VR players, because there is no screen in VR where they could be
	 * attached. Don't use screen UI for elements that are required for playing, or VR players won't be able
	 * to play properly! You can also check whether a player is using VR with {@link Player.isUsingVR} and
	 * add a 3D UI only for VR players using {@link UIElement.players}.
	*/
	class ScreenUIElement { 
		/**
		 * The main widget of this component
		*/
		widget: Widget;
		/**
		 * The X position of the UI element on the screen. Can be in pixels or relative to the screen size.
		*/
		positionX: number;
		/**
		 * The X position of the UI element on the screen. Can be in pixels or relative to the screen size.
		*/
		positionY: number;
		/**
		 * If true, {@link positionX} is relative to the screen (or window) size instead of in pixels, where the whole
		 * screen is 1.0 units wide. Default: true
		*/
		relativePositionX: boolean;
		/**
		 * If true, {@link positionY} is relative to the screen (or window) size instead of in pixels, where the whole
		 * screen is 1.0 units high. Default: true
		*/
		relativePositionY: boolean;
		/**
		 * Width to use for rendering the UI. Can be in pixels or relative to the screen size. Default: 160
		*/
		width: number;
		/**
		 * Height to use for rendering the UI. Can be in pixels or relative to the screen size. Default: 90
		*/
		height: number;
		/**
		 * If true, {@link width} is relative to the screen (or window) size instead of in pixels, where the whole screen
		 * is 1.0 units wide. Default: false
		*/
		relativeWidth: boolean;
		/**
		 * If true, {@link height} is relative to the screen (or window) size instead of in pixels, where the whole screen
		 * is 1.0 units high. Default: false
		*/
		relativeHeight: boolean;
		/**
		 * The horizontal anchor point of the UI. Determines where {@link positionX} is in relation to the UI:
		 * for 0 it is at the left side, 0.5 is at the center, 1.0 is the right side. Default: 0
		*/
		anchorX: number;
		/**
		 * The vertical anchor point of the UI. Determines where {@link positionY} is in relation to the UI:
		 * for 0 it is at the top, 0.5 is at the center, 1.0 is the bottom. Default: 0
		*/
		anchorY: number;
		/**
		 * Determine which players see the UI. By default, it will be shown for all players (except for VR players).
		*/
		players: PlayerPermission;
		clone() : ScreenUIElement;
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
		 * Return metadata of face that is currently pointing up
		*/
		getCurrentFaceMetadata(): string;
		/**
		 * Return index of face that is currently pointing up. Return -1 if the object is invalid.
		*/
		getCurrentFaceIndex(): number;
		/**
		 * Return all face names for this dice type
		*/
		getAllFaceNames(): string[];
		/**
		 * Return all face metadata for this dice type
		*/
		getAllFaceMetadata(): string[];
	}

	/**
	 * Contains methods to modify and check the global snap grid. Accessed through {@link GameWorld.grid}
	*/
	class GlobalGrid { 
		/**
		 * Set the width of each grid cell in cm
		*/
		setWidth(width: number): void;
		/**
		 * Set the visibility of the grid as defined by {@link GridVisibility}
		*/
		setVisibility(visibility: number): void;
		/**
		 * Set an offset for the grid relative to the height of a cell (between 0 and 1)
		*/
		setVerticalOffset(offset: number): void;
		/**
		 * Set the type of the grid, as defined by {@link GridType}
		*/
		setType(type: number): void;
		/**
		 * Set whether thick lines are used to display the grid
		*/
		setThickLines(thick: boolean): void;
		/**
		 * Set how objects snap to the grid, as defined by {@link GridSnapType}
		*/
		setSnapType(type: number): void;
		/**
		 * Set the rotation of the grid in degrees
		*/
		setRotation(rotation: number): void;
		/**
		 * Set an offset for the grid relative to the width of a cell (between 0 and 1)
		*/
		setHorizontalOffset(offset: number): void;
		/**
		 * Set the height of each grid cell in cm
		*/
		setHeight(height: number): void;
		/**
		 * Set the color of the grid
		*/
		setColor(color: Color | [r: number, g: number, b: number, a: number]): void;
		/**
		 * Return whether thick lines are used to display the grid
		*/
		hasThickLines(): boolean;
		/**
		 * Return the width of each grid cell in cm
		*/
		getWidth(): number;
		/**
		 * Return the type of the grid as defined by {@link GridVisibility}
		*/
		getVisibility(): number;
		/**
		 * Return the vertical grid offset
		*/
		getVerticalOffset(): number;
		/**
		 * Return the type of the grid, as defined by {@link GridType}
		*/
		getType(): number;
		/**
		 * Return how objects snap to the grid, as defined by {@link GridSnapType}
		*/
		getSnapType(): number;
		/**
		 * Return the rotation of the grid in degrees (between -90 and 90)
		*/
		getRotation(): number;
		/**
		 * Return the horizontal grid offset
		*/
		getHorizontalOffset(): number;
		/**
		 * Return the height of each grid cell in cm
		*/
		getHeight(): number;
		/**
		 * Return the color of the grid
		*/
		getColor(): Color;
	}

	/**
	 * Contains methods to modify and check the lighting settings. Accessed through {@link GameWorld.lighting}
	*/
	class LightingSettings { 
		/**
		 * Set the specular intensity for the main directional light. Only a value of 1 is physically correct,
		 * lower values can be used to reduce specular highlights. Minimum 0, maximum 1. Default: 1
		*/
		setMainLightSpecularIntensity(intensity: number): void;
		/**
		 * Set the intensity multiplier of the main directional light. Minimum 0.2, maximum 5. Default: 1.0
		*/
		setMainLightIntensity(intensity: number): void;
		/**
		 * Set the color of the main directional light. Default: White
		*/
		setMainLightColor(color: Color | [r: number, g: number, b: number, a: number]): void;
		/**
		 * Set the azimuth angle of the main directional light. Minimum -180, maximum 180. Default: 0
		*/
		setMainLightAzimuth(angle: number): void;
		/**
		 * Set the altitude angle of the main directional light. Minimum 10, maximum 90. Default: 90
		*/
		setMainLightAltitude(angle: number): void;
		/**
		 * Return the specular intensity for the main directional light. Only a value of 1 is physically correct,
		 * lower values can be used to reduce specular highlights. Minimum 0, maximum 1. Default: 1
		*/
		getMainLightSpecularIntensity(): number;
		/**
		 * Return the intensity multiplier of the main directional light.
		*/
		getMainLightIntensity(): number;
		/**
		 * Return the color of the main directional light
		*/
		getMainLightColor(): Color;
		/**
		 * Return the azimuth angle of the main directional light.
		*/
		getMainLightAzimuth(): number;
		/**
		 * Return the altitude angle of the main directional light.
		*/
		getMainLightAltitude(): number;
	}

	/**
	 * Contains methods to interact with the turn system: rounds, phases, and turns.
	 * Accessed through {@link GameWorld.turns}
	*/
	class TurnSystem { 
		/**
		 * Called when a turn (or phase, or round) changes.
		 * @param {number} previousTurn - The active turn before the change
		 * @param {number} previousPhase - The active phase before the change
		 * @param {number} previousRound - The active round before the change
		*/
		onTurnChanged: MulticastDelegate<(previousTurn: number, previousPhase: number, previousRound: number) => void>;
		/**
		 * Set configured phases
		*/
		setPhases(phases: PhaseDetails[]): void;
		/**
		 * Set the current turn. Does not trigger a message for players or the {@link onTurnChanged} event.
		*/
		setCurrentTurn(turn: number): void;
		/**
		 * Sets the current round. Does not trigger a message for players or the {@link onTurnChanged} event.
		*/
		setCurrentRound(round: number): void;
		/**
		 * Set the current phase index
		*/
		setCurrentPhaseIndex(phase: number): void;
		/**
		 * Moves to the previous turn. Will also change phase and round as required and cause a message to appear for all players.
		 * Does the same as a player clicking on the previous turn button in the context menu. Triggers a message for players and
		 * the {@link onTurnChanged} event.
		*/
		previousTurn(): void;
		/**
		 * Moves to the next turn. Will also change phase and round as required and cause a message to appear for all players.
		 * Does the same as a player clicking on the next turn button in the context menu. Triggers a message for players and
		 * the {@link onTurnChanged} event.
		*/
		nextTurn(): void;
		/**
		 * Return the current turn. Returns -1 if currently not in a phase that has turns.
		*/
		getCurrentTurn(): number;
		/**
		 * Return the current round
		*/
		getCurrentRound(): number;
		/**
		 * Return the current phase. Returns -1 if no phases are configured.
		*/
		getCurrentPhaseIndex(): number;
		/**
		 * Return the current phase. Returns a phase with an empty name if no phases are configured.
		*/
		getCurrentPhase(): PhaseDetails;
		/**
		 * Return all configured phases
		*/
		getAllPhases(): PhaseDetails[];
		/**
		 * Return the currently active players. Returns an empty array if no phases exist, and an array with a single
		 * element of the player whose turn it is if the current phase is set to take turns.
		*/
		getActivePlayers(): Player[];
	}

	/**
	 * A sound that can be played. Create Sound objects by importing sound files using {@link GameWorld.importSound}
	 * or {@link GameWorld.importSoundFromURL}.
	*/
	class Sound { 
		/**
		 * Called when the sound has finished or failed to load.
		 * @param {boolean} success - True when the sound has loaded successfully and can be played, false if it has failed to load
		*/
		onLoadComplete: Delegate<(success: boolean) => void>;
		/**
		 * Called when playback of the sound has finished. Not called when the sound is interrupted (for example by calling {@link stop})
		 * or while the sound is played in a loop.
		*/
		onPlaybackFinished: Delegate<() => void>;
		/**
		 * Stop looping the sound if it is currently played in a loop. Doesn't stop playback immediately, only after the current playback finishes.
		 * Has no effect if the sound is not currently played in a loop.
		*/
		stopLoop(): void;
		/**
		 * Stop playing the sound immediately
		*/
		stop(): void;
		/**
		 * Start playing the sound at the location of an object. It will move together with the object.
		 * If the sound is already playing, the playback time will be moved.
		 * If the sound isn't loaded yet when this method is called, the sound will be played as soon as loading has finished.
		 * @param {GameObject} object - The object from which the sound should originate.
		 * @param {number} startTime - The starting playback time. Set to 0 to play from the beginning. Default: 0
		 * @param {number} volume - The volume multiplier at which to play the sound, 0 < volume < 2. Default: 1
		 * @param {boolean} loop - If true, play the sound again from the beginning once it finishes playing. You can stop playback using
		 * {@link stop}, {@link stopLoop}, or by calling a play method with the loop parameter set to false.
		 * @param {PlayerPermission} players - Determines for which players the sound will be played. By default, it will be played for all players
		*/
		playAttached(object: GameObject, startTime?: number, volume?: number, loop?: boolean, players?: PlayerPermission): void;
		/**
		 * Start playing the sound at a given position. If it is already playing, the playback time will be moved.
		 * If the sound isn't loaded yet when this method is called, the sound will be played as soon as loading has finished.
		 * @param {Vector} position - The position where the sound should originate.
		 * @param {number} startTime - The starting playback time. Set to 0 to play from the beginning. Default: 0
		 * @param {number} volume - The volume multiplier at which to play the sound, 0 < volume < 2. Default: 1
		 * @param {boolean} loop - If true, play the sound again from the beginning once it finishes playing. You can stop playback using
		 * {@link stop}, {@link stopLoop}, or by calling a play method with the loop parameter set to false.
		 * @param {PlayerPermission} players - Determines for which players the sound will be played. By default, it will be played for all players
		*/
		playAtLocation(position: Vector | [x: number, y: number, z: number], startTime?: number, volume?: number, loop?: boolean, players?: PlayerPermission): void;
		/**
		 * Start playing the sound. It will not appear to come from any location. If it is already playing, the playback time will be moved.
		 * If the sound isn't loaded yet when this method is called, the sound will be played as soon as loading has finished.
		 * @param {number} startTime - The starting playback time. Set to 0 to play from the beginning. Default: 0
		 * @param {number} volume - The volume multiplier at which to play the sound, 0 < volume < 2. Default: 1
		 * @param {boolean} loop - If true, play the sound again from the beginning once it finishes playing. You can stop playback using
		 * {@link stop}, {@link stopLoop}, or by calling a play method with the loop parameter set to false.
		 * @param {PlayerPermission} players - Determines for which players the sound will be played. By default, it will be played for all players
		*/
		play(startTime?: number, volume?: number, loop?: boolean, players?: PlayerPermission): void;
		/**
		 * Return whether the sound is currently playing
		*/
		isPlaying(): boolean;
		/**
		 * Return whether the sound has finished loading successfully and is ready to play
		*/
		isLoaded(): boolean;
		/**
		 * Return the current playback time of the sound in seconds. Will be 0 if the sound is not playing.
		*/
		getPlaybackTime(): number;
		/**
		 * Return the current playback time of the sound as a fraction of its duration. Will be 0 if the sound is not playing.
		*/
		getPlaybackFraction(): number;
		/**
		 * Return the duration of the sound in seconds. Will be 0 if the sound is not loaded.
		*/
		getDuration(): number;
		/**
		 * Destroy this sound and free its resources. Call this function when you don't need a loaded sound anymore.
		 * The object will become non-functional, and it will be removed from the cache. Note that multiple calls to
		 * {@link GameWorld.importSound} or {@link GameWorld.importSoundFromURL} with the same parameters return the
		 * same object when using caching, so if you use the same sound at multiple places in your code, you should
		 * be careful when you destroy it.
		*/
		destroy(): void;
	}

	/**
	 * An zone that changes game behavior in a defined part of the playing area
	*/
	class Zone { 
		/**
		 * Called when the zone is destroyed
		 * @param {Zone} zone - The destroyed zone
		*/
		onDestroyed: MulticastDelegate<(zone: this) => void>;
		/**
		 * Called every tick.
		 * @param {Zone} zone - The reference zone
		 * @param {number} milliseconds - Duration of the previous tick
		*/
		onTick: MulticastDelegate<(zone: this, deltaTime: number) => void>;
		/**
		 * Called when an object enters the zone
		*/
		onBeginOverlap: MulticastDelegate<(zone: this, object: GameObject) => void>;
		/**
		 * Called when an object leaves the zone
		*/
		onEndOverlap: MulticastDelegate<(zone: this, object: GameObject) => void>;
		/**
		 * Set which players are allowed to stack cards in the zone
		 * @param {number} permission - The new permission, as defined by {@link ZonePermission}
		*/
		setStacking(permission: number): void;
		/**
		 * Set which players are allowed to snap objects in the zone
		 * @param {number} permission - The new permission, as defined by {@link ZonePermission}
		*/
		setSnapping(permission: number): void;
		/**
		 * Set whether a player slot is an owner of the zone
		*/
		setSlotOwns(playerSlot: number, owner: boolean): void;
		/**
		 * Set the shape of the zone
		 * @param {number} shape - The new shape, as defined by {@link ZoneShape}
		*/
		setShape(shape: number): void;
		/**
		 * Set the zone's scale. At scale 1 the size is 1cm in each direction, so the scale also
		 * corresponds to the size in cm.
		 * @param {Vector} scale - The new scale
		*/
		setScale(scale: Vector | [x: number, y: number, z: number]): void;
		/**
		 * Set the data that will be stored in save game states. The data is available using {@link getSavedData} when the object
		 * script is run after loading a save state. Try to keep this data small and don't change it frequently, it needs to
		 * be sent over the network to all clients.
		 * @param {string} data - Data to store, maximum length 1023 characters
		*/
		setSavedData(data: string): void;
		/**
		 * Set the zone's rotation.
		 * @param {Rotator} rotation - The new rotation
		*/
		setRotation(rotation: Rotator | [pitch: number, yaw: number, roll: number]): void;
		/**
		 * Set the zone's position.
		 * @param {Vector} position - The new position
		*/
		setPosition(position: Vector | [x: number, y: number, z: number]): void;
		/**
		 * Set for which players objects in the zone are visible
		 * @param {number} permission - The new permission, as defined by {@link ZonePermission}
		*/
		setObjectVisibility(permission: number): void;
		/**
		 * Set which players are allowed to interact with objects in the zone
		 * @param {number} permission - The new permission, as defined by {@link ZonePermission}
		*/
		setObjectInteraction(permission: number): void;
		/**
		 * Set which players are allowed to insert into containers in the zone
		 * @param {number} permission - The new permission, as defined by {@link ZonePermission}
		*/
		setInserting(permission: number): void;
		/**
		 * Set the zone's unique id. Returns whether the id was changed successfully.
		 * Fails if the id is already used by another zone.
		 * @param {string} id - The new unique id
		*/
		setId(iD: string): boolean;
		/**
		 * Set which cursors are hidden from other players while in the zone
		 * @param {number} permission - The new permission, as defined by {@link ZonePermission}
		*/
		setCursorHidden(permission: number): void;
		/**
		 * Set the zone's color
		 * @param {Color} color - The new color. The alpha channel determines the zone's translucency. It can't be lower than 0.1, zone translucency will not be updated if the alpha channel is below 0.1
		*/
		setColor(color: Color | [r: number, g: number, b: number, a: number]): void;
		/**
		 * Set whether the zone is visible when players are not in zone mode
		 * @param {boolean} alwaysVisible - The new color
		*/
		setAlwaysVisible(alwaysVisible: boolean): void;
		/**
		 * Return whether the zone is valid. A zone becomes invalid after it has been destroyed or deleted by a player
		*/
		isValid(): boolean;
		/**
		 * Return whether a given player slot is an owner of the zone
		*/
		isSlotOwner(playerIndex: number): boolean;
		/**
		 * Return whether an object overlaps the zone. Any object that touches a zone is considered to be in it.
		 * @param {GameObject} object - The object to check for an overlap
		*/
		isOverlapping(object: GameObject): boolean;
		/**
		 * Return whether the zone is visible when players are not in zone mode
		*/
		isAlwaysVisible(): boolean;
		/**
		 * Return which players are allowed to stack cards in the zone, as defined by {@link ZonePermission}
		*/
		getStacking(): number;
		/**
		 * Return which players are allowed to snap objects in the zone, as defined by {@link ZonePermission}
		*/
		getSnapping(): number;
		/**
		 * Return the shape of the zone, as defined by {@link ZoneShape}
		*/
		getShape(): number;
		/**
		 * Return the zone's scale
		*/
		getScale(): Vector;
		/**
		 * Return data that was stored using {@link setSavedData} or loaded from a saved state.
		*/
		getSavedData(): string;
		/**
		 * Return the zone's rotation
		*/
		getRotation(): Rotator;
		/**
		 * Return the zone's position
		*/
		getPosition(): Vector;
		/**
		 * Return a list of the owning player slots of the zone
		*/
		getOwningSlots(): number[];
		/**
		 * Return all objects in the zone. Any object that touches a zone is considered to be in it.
		*/
		getOverlappingObjects(): GameObject[];
		/**
		 * Return for which players objects in the zone are visible, as defined by {@link ZonePermission}
		*/
		getObjectVisibility(): number;
		/**
		 * Return which players are allowed to interact with objects in the zone, as defined by {@link ZonePermission}
		*/
		getObjectInteraction(): number;
		/**
		 * Return which players are allowed to insert into containers in the zone, as defined by {@link ZonePermission}
		*/
		getInserting(): number;
		/**
		 * Return the zone's unique id
		*/
		getId(): string;
		/**
		 * Return which cursors are hidden from other players while in the zone, as defined by {@link ZonePermission}
		*/
		getCursorHidden(): number;
		/**
		 * Return the zone's color, including its alpha value
		*/
		getColor(): Color;
		/**
		 * Destroy the zone
		*/
		destroy(): void;
	}

	/**
	 * Represents a Tabletop Playground package. Use {@link GameWorld.getPackageById} or
	 * {@link GameWorld.getAllowedPackages} to create Package objects.
	*/
	class Package { 
		/**
		 * Return whether the package is currently allowed in the game
		*/
		isAllowed(): boolean;
		/**
		 * Return the unique id of the package. This id can be found in the manifest.json file in the package directory.
		*/
		getUniqueId(): string;
		/**
		 * Return filenames (including relative paths) for all textures in this package.
		*/
		getTextureFiles(): string[];
		/**
		 * Return the unique ids of all templates in this package
		*/
		getTemplateIds(): string[];
		/**
		 * Return filenames (including relative paths) for all sounds in this package.
		*/
		getSoundFiles(): string[];
		/**
		 * Return filenames (including relative paths) for all scripts in this package.
		*/
		getScriptFiles(): string[];
		/**
		 * Return the name of the package
		*/
		getName(): string;
		/**
		 * Return filenames (including relative paths) for all models in this package.
		*/
		getModelFiles(): string[];
		/**
		 * Return filenames (including relative paths) for all fonts in this package.
		*/
		getFontFiles(): string[];
		/**
		 * Start a request to allow the package. If some players don't have the package installed, they will be asked
		 * to subscribe to the package in the same way as when adding a package through the object library. If
		 * all players already have the package installed, it will be allowed immediately after calling this method.
		*/
		allow(): void;
	}

	/**
	 * An label that shows text on the table. Can be placed and modified by players
	*/
	class Label { 
		/**
		 * Set the label's text
		 * @param {string} text - The new text
		*/
		setText(text: string): void;
		/**
		 * Set the label's scale.
		 * @param {number} scale - The new scale
		*/
		setScale(scale: number): void;
		/**
		 * Set the label's rotation.
		 * @param {Rotator} rotation - The new rotation
		*/
		setRotation(rotation: Rotator | [pitch: number, yaw: number, roll: number]): void;
		/**
		 * Set the label's position.
		 * @param {Vector} position - The new position
		*/
		setPosition(position: Vector | [x: number, y: number, z: number]): void;
		/**
		 * Set the label's player slot. Set to -1 to remove association to a slot. If a player slot is set, the label text will
		 * be the player's name in that slot, or the slot name if there is no player in the slot.
		 * @param {Color} color - The new text
		*/
		setPlayerSlot(slot: number): void;
		/**
		 * Set the label's unique id. Returns whether the id was changed successfully.
		 * Fails if the id is already used by another label.
		 * @param {string} id - The new unique id
		*/
		setId(iD: string): boolean;
		/**
		 * Set the TrueType font file used for the label. Place your font files in the "Fonts" folder
		 * of your package.
		 * @param {string} fontFilename - The filename of the TTF file to load. Set to empty string
		 * to use the standard font.
		 * @param {string} packageId - The id of the package that contains the TTF file (in the
		 * Fonts folder). Can usually be empty when used from scripts to use the same package
		 * that contains the script file, but you need to explicitly pass {@link refPackageId} for
		 * the current package or a package id when you use it in a callback. You can find package
		 * ids in the manifest.json file in package folders. Usually you won't use this parameter,
		 * unless you have a specific reason to load a font from a different package than where
		 * the script is located.
		*/
		setFont(fontFilename: string, packageId?: string): void;
		/**
		 * Set the label's color
		 * @param {Color} color - The new color
		*/
		setColor(color: Color | [r: number, g: number, b: number, a: number]): void;
		/**
		 * Return whether the label is valid. A label becomes invalid after it has been destroyed or deleted by a player
		*/
		isValid(): boolean;
		/**
		 * Return the label's text
		*/
		getText(): string;
		/**
		 * Return the label's scale
		*/
		getScale(): number;
		/**
		 * Return the label's rotation
		*/
		getRotation(): Rotator;
		/**
		 * Return the label's position
		*/
		getPosition(): Vector;
		/**
		 * Return the label's player slot. If no player slot is set, returns -1. If a player slot is set, the label text will
		 * be the player's name in that slot, or the slot name if there is no player in the slot.
		*/
		getPlayerSlot(): number;
		/**
		 * Return the label's unique id
		*/
		getId(): string;
		/**
		 * Return the package id for the package containing the TrueType font used for the label.
		 * Returns an empty string if no custom font is used.
		*/
		getFontPackage(): string;
		/**
		 * Return the filename for the custom TrueType font used for the label. Returns an empty string
		 * if no custom font is used.
		*/
		getFontFileName(): string;
		/**
		 * Return the label's color
		*/
		getColor(): Color;
		/**
		 * Destroy the label
		*/
		destroy(): void;
	}

	/**
	 * The game world. Contains all global methods of the API. You don't create an instance of this class
	 * directly, instead use the {@link world} object that always exists.
	*/
	class GameWorld { 
		/**
		 * Access to the global grid configuration
		*/
		grid: GlobalGrid;
		/**
		 * Access to the lighting configuration
		*/
		lighting: LightingSettings;
		/**
		 * Access to the turn system
		*/
		turns: TurnSystem;
		/**
		 * Update a global UI element. Will not do anything if called with a UI element that is not currently part of
		 * the global UI elements.
		 * @param {UIElement} - The UI element to be updated
		*/
		updateUI(element: UIElement): void;
		/**
		 * Update a global UI element. Will not do anything if called with a UI element that is not currently part of
		 * the global UI elements.
		 * @param {UIElement} - The UI element to be updated
		*/
		updateScreenUI(element: ScreenUIElement): void;
		/**
		 * Start debug mode on the given port. You can use the Chrome DevTools or the Visual Studio Code debugger
		 * to connect to the specified port and debug your scripts.<br>
		 * For example, with port 9229 (the default), open the following URL to open the DevTools:
		 * ``devtools://devtools/bundled/inspector.html?v8only=true&ws=localhost:9229``<br>
		 * For Visual Studio Code, add the following to your debug configurations:<br>
		 * <pre>{
		 *   "name": "Inspector",
		 *       "type": "node",
		 *       "protocol": "inspector",
		 *       "request": "attach",
		 *       "address": "localhost",
		 *       "port": 9229
		 * }</pre>
		*/
		startDebugMode(port?: number): void;
		/**
		 * Find all objects hits with a sphere that is moved along a line, ordered by distance to start
		 * @param {Vector} start - Starting point of the sphere
		 * @param {Vector} end - End point of the sphere movement
		 * @param {number} radius - Radius of the sphere
		*/
		sphereTrace(start: Vector | [x: number, y: number, z: number], end: Vector | [x: number, y: number, z: number], radius: number): TraceHit[];
		/**
		 * Find all objects that would collide with a sphere
		 * @param {Vector} position - Center of the sphere
		 * @param {number} radius - Radius of the sphere
		*/
		sphereOverlap(position: Vector | [x: number, y: number, z: number], radius: number): GameObject[];
		/**
		 * Show a ping for all players, similar to when a player places a ping.
		 * @param {Vector} position - The position to ping
		 * @param {Color} color - The color of the ping
		 * @param {boolean} playSound - If true, the ping sound will be played for all players
		*/
		showPing(position: Vector | [x: number, y: number, z: number], color: Color | [r: number, g: number, b: number, a: number], playSound: boolean): void;
		/**
		 * Replace a global UI element. Will not do anything if called with an index that doesn't have a UI element.
		 * @param {number} - The index of the UI element to replace
		 * @param {UIElement} - The UI element to be stored at the index
		*/
		setUI(index: number, element: UIElement): void;
		/**
		 * Set the team of a player slot
		 * @param {number} slot - The player slot (0-19)
		 * @param {number} team - The new team for the slot. Use 0 to not associate the slot with a team.
		*/
		setSlotTeam(slot: number, team: number): void;
		/**
		 * Set the color of a player slot
		 * @param {number} slot - The player slot (0-19)
		 * @param {Color} team - The new player slot color.
		*/
		setSlotColor(slot: number, color: Color | [r: number, g: number, b: number, a: number]): void;
		/**
		 * Set whether a message with results is shown whenever rolled dice come to rest
		*/
		setShowDiceRollMessages(show: boolean): void;
		/**
		 * Replace a global UI element. Will not do anything if called with an index that doesn't have a UI element.
		 * @param {number} - The index of the UI element to replace
		 * @param {UIElement} - The UI element to be stored at the index
		*/
		setScreenUI(index: number, element: ScreenUIElement): void;
		/**
		 * Set the data that will stored in save game states. The data is available using {@link getSavedData} when the global
		 * script is run after loading a save state. Try to keep this data small and don't change it frequently, it needs to
		 * be sent over the network to all clients. A similar method exists for each game object:
		 * {@link GameObject.setSavedData}. <br>
		 * If you want to use custom data that is not a string, you can encode it to JSON using `JSON.stringify()`, and then
		 * decode what you get from {@link getSavedData} using `JSON.parse()`.
		 * @param {string} data - Data to store, maximum length 1023 characters
		 * @param {string} key - Key for the data. This works like a dictionary, you can store different data for each key
		*/
		setSavedData(data: string, key?: string): void;
		/**
		 * Set the gravity multiplier. 1 is standard gravity, 0 will disable gravity. Wakes up physics
		 * simulation for all objects that are not locked (for example because they are ground objects,
		 * or because the locked physics option is active)
		 * @param {number} multiplier - The new gravity multiplier, between 0 and 2
		*/
		setGravityMultiplier(multiplier: number): void;
		/**
		 * Set whether the floor of the map should be hidden. Persisted in saved states.
		 * Does not have an effect in 3D maps.
		*/
		setFloorHidden(hidden: boolean): void;
		/**
		 * Set the image shown as background of the map.
		 * @param {string} textureName - The filename of the image to load. Use an empty string
		 * to return to the default background for the map. Default: empty string.
		 * @param {string} packageId - The id of the package that contains the image file (in the
		 * Textures folder). Can usually be empty when used from scripts to use the same package
		 * that contains the script file, but you need to explicitly pass {@link refPackageId} for
		 * the current package or a package id when you use it in a callback. You can find package
		 * ids in the manifest.json file in package folders. Usually you won't use this parameter,
		 * unless you have a specific reason to load an image from a different package than where
		 * the script is located.
		*/
		setBackground(textureName?: string, packageId?: string): void;
		/**
		 * Reset scripting environment and reload all scripts
		*/
		resetScripting(): void;
		/**
		 * Remove a global UI element.
		 * @param {UIElement} - The UI element to be removed
		*/
		removeUIElement(element: UIElement): void;
		/**
		 * Remove a global UI element.
		 * @param {index} index - The index of the UI element to remove
		*/
		removeUI(index: number): void;
		/**
		 * Remove a global UI element.
		 * @param {UIElement} - The UI element to be removed
		*/
		removeScreenUIElement(element: ScreenUIElement): void;
		/**
		 * Remove a global UI element.
		 * @param {index} index - The index of the UI element to remove
		*/
		removeScreenUI(index: number): void;
		/**
		 * Remove a drawn line from the table.
		*/
		removeDrawingLineObject(line: DrawingLine): void;
		/**
		 * Remove a drawn line at the given index from the table.
		*/
		removeDrawingLine(index: number): void;
		/**
		 * Remove a custom action by identifier or name.
		 * @param {string} identifier - The identifier or name of the action to remove
		*/
		removeCustomAction(identifier: string): void;
		/**
		 * @deprecated Synonym for for {@link TurnSystem.previousTurn}
		*/
		previousTurn(): void;
		/**
		 * @deprecated Synonym for for {@link TurnSystem.nextTurn}
		*/
		nextTurn(): void;
		/**
		 * Find all object hits on the given line, ordered by distance to start
		 * @param {Vector} start - Starting point of the line
		 * @param {Vector} end - End point of the line
		*/
		lineTrace(start: Vector | [x: number, y: number, z: number], end: Vector | [x: number, y: number, z: number]): TraceHit[];
		/**
		 * Return whether the floor of the map is currently hidden.
		*/
		isFloorHidden(): boolean;
		/**
		 * Load a text file from the Scripts folder of a package and return the text as string.
		 * @param {string} filename - The filename of the text file
		 * @param {string} packageId - The id of the package that contains the text file (in the
		 * Scripts folder). Can usually be empty when used from scripts to use the same package
		 * that contains the script file, but you need to explicitly pass {@link refPackageId} for
		 * the current package or a package id when you use it in a callback. You can find package
		 * ids in the manifest.json file in package folders. Usually you won't use this parameter,
		 * unless you have a specific reason to load a text file from a different package than where
		 * the script is located.
		*/
		importText(filename: string, packageId?: string): string;
		/**
		 * Load a sound file from a web URL and store it in a sound object that can be played.
		 * Supports WAV, MP3, and FLAC files.
		 * @param {string} url - The URL from which to load the sound
		 * @param {boolean} ignoreCache - If true, load a new {@link Sound} even if a cached version already exists.
		 * Will take longer and take additional resources, only use if you need to play the same sound file multiple
		 * times at the same time. Default: false
		*/
		importSoundFromURL(url: string, ignoreCache?: boolean): Sound;
		/**
		 * Load a sound file from the Sounds folder of a package and store it in a sound object that can be played.
		 * Supports WAV, MP3, and FLAC files.
		 * @param {string} filename - The filename of the sound
		 * @param {string} packageId - The id of the package that contains the sound file (in the
		 * Sounds folder). Can usually be empty when used from scripts to use the same package
		 * that contains the script file, but you need to explicitly pass {@link refPackageId} for
		 * the current package or a package id when you use it in a callback. You can find package
		 * ids in the manifest.json file in package folders. Usually you won't use this parameter,
		 * unless you have a specific reason to load a sound from a different package than where
		 * the script is located.
		 * @param {boolean} ignoreCache - If true, load a new {@link Sound} even if a cached version already exists.
		 * Will take longer and take additional resources, only use if you need to play the same sound file multiple
		 * times at the same time. Default: false
		*/
		importSound(filename: string, packageId?: string, ignoreCache?: boolean): Sound;
		/**
		 * Return the zone with the specified id
		 * @param {string} objectId - The unique id of the zone
		*/
		getZoneById(zoneId: string): Zone | undefined;
		/**
		 * Get an array of all global UI elements. Modifying the array won't change
		 * the actual UIs, use {@link setUI} or {@link updateUI} to update.
		*/
		getUIs(): UIElement[];
		/**
		 * Return the package id of a template
		*/
		getTemplatePackageId(templateId: string): string;
		/**
		 * Return the name of a template
		*/
		getTemplateName(templateId: string): string;
		/**
		 * Return the Z coordinate of the table at a given point. Returns 0 if the point is outside of the table bounds.
		 * For many tables this will return the same values for the entire surface, but some tables (like the included
		 * Poker table) have more complex surface geometry.
		 * @param {Vector} position - The point where the table height should be evaluated. The Z coordinate of the Vector
		 * is ignored. Returns table height for the center of the map (0,0) if this parameter is not given.
		*/
		getTableHeight(position?: Vector | [x: number, y: number, z: number]): number;
		/**
		 * Return the team (1-8) of a player slot. Returns 0 if the player slot is not associated to a team.
		 * @param {number} slot - The player slot (0-19)
		*/
		getSlotTeam(slot: number): number;
		/**
		 * Return the color of a player slot.
		 * @param {number} slot - The player slot (0-19)
		*/
		getSlotColor(slot: number): Color;
		/**
		 * Return whether a message with results is shown whenever rolled dice come to rest
		*/
		getShowDiceRollMessages(): boolean;
		/**
		 * Get an array of all global UI elements. Modifying the array won't change
		 * the actual UIs, use {@link setUI} or {@link updateUI} to update.
		*/
		getScreenUIs(): ScreenUIElement[];
		/**
		 * Return data that was stored using {@link setSavedData} or loaded from a saved state.
		 * @param {string} key - Key for which to retrieve the data.
		*/
		getSavedData(key?: string): string;
		/**
		 * Return the player occupying the specified slot
		 * @param {number} slot - The player slot (0-19)
		*/
		getPlayerBySlot(slot: number): Player | undefined;
		/**
		 * Return the player with the given name
		 * @param {name} name - The name of the player
		*/
		getPlayerByName(name: string): Player | undefined;
		/**
		 * Return the package with the specified id. Can return packages that are currently not allowed,
		 * but only finds packages that exist on the host.
		*/
		getPackageById(packageId: string): Package | undefined;
		/**
		 * Return all objects in the game with the specified template type
		 * @param {string} templateId - The template id to search for
		*/
		getObjectsByTemplateId(templateId: string): GameObject[];
		/**
		 * Return an array of all objects with a given object group id.
		 * @param {number} groupId - The group id to query
		*/
		getObjectsByGroupId(groupId: number): GameObject[];
		/**
		 * Return an array of all currently used object group ids.  Objects with the same group id are always picked up together.
		*/
		getObjectGroupIds(): number[];
		/**
		 * Return the game object with the specified Id
		 * @param {string} objectId - The unique id of the object
		*/
		getObjectById(objectId: string): GameObject | undefined;
		/**
		 * Return the label with the specified id
		 * @param {string} objectId - The unique id of the label
		*/
		getLabelById(labelId: string): Label | undefined;
		/**
		 * Return the current gravity multiplier
		*/
		getGravityMultiplier(): number;
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
		static getExecutionReason(): string;
		/**
		 * Return all drawing lines on the object.
		*/
		getDrawingLines(): DrawingLine[];
		/**
		 * @deprecated Synonym for {@link TurnSystem.getCurrentRound}
		*/
		getCurrentTurn(): number;
		/**
		 * Return the package id of the current background. Returns an empty string if no background is set.
		*/
		getBackgroundPackageId(): string;
		/**
		 * Return the filename of the current background. Empty string if no custom background is active.
		*/
		getBackgroundFilename(): string;
		/**
		 * Get all zones currently in the game
		*/
		getAllZones(): Zone[];
		/**
		 * Return all tags that currently exist in the game
		*/
		getAllTags(): string[];
		/**
		 * Return all tables currently in the game
		*/
		getAllTables(): StaticObject[];
		/**
		 * Return all players currently in the game
		*/
		getAllPlayers(): Player[];
		/**
		 * Return all currently allowed packages
		*/
		getAllowedPackages(): Package[];
		/**
		 * Return all interactive objects currently in the game
		 * @param {boolean} skipContained - If true, don't return objects in containers.
		 * Even when false, objects within lazy containers that haven't been loaded yet will never be returned. Use
		 * {@link Container.getItems} to load and return items in lazy containers. Default: false
		*/
		getAllObjects(skipContained?: boolean): GameObject[];
		/**
		 * Get all labels currently in the game
		*/
		getAllLabels(): Label[];
		/**
		 * Draw a point. The sphere will only be visible on for the host!
		 * @param {Vector} position - Position of the point
		 * @param {number} size - Radius of the sphere in cm
		 * @param {Color} color - Color of the sphere. Alpha value is not used.
		 * @param {number} duration - Amount of time in seconds to show the point. Can be 0 to show for one frame only.
		 * @param {number} thickness - Thickness of the lines. One pixel thick if 0, cm thickness for values > 0.
		*/
		drawDebugSphere(position: Vector | [x: number, y: number, z: number], radius: number, color: Color | [r: number, g: number, b: number, a: number], duration: number, thickness?: number): void;
		/**
		 * Draw a point. The point will only be visible on for the host!
		 * @param {Vector} position - Position of the point
		 * @param {number} size - Size of the point in cm
		 * @param {Color} color - Color of the point. Alpha value is not used.
		 * @param {number} duration - Amount of time in seconds to show the point. Can be 0 to show for one frame only.
		*/
		drawDebugPoint(position: Vector | [x: number, y: number, z: number], size: number, color: Color | [r: number, g: number, b: number, a: number], duration: number): void;
		/**
		 * Draw a line in 3d space. The line will only be visible on for the host!
		 * @param {Vector} start - Starting point of the line
		 * @param {Vector} end - End point of the line
		 * @param {Color} color - Color of the line. Alpha value is not used.
		 * @param {number} duration - Amount of time in seconds to show the line. Can be 0 to show for one frame only
		 * @param {number} thickness - Thickness of the line. One pixel thick if 0, cm thickness for values > 0.
		*/
		drawDebugLine(start: Vector | [x: number, y: number, z: number], end: Vector | [x: number, y: number, z: number], color: Color | [r: number, g: number, b: number, a: number], duration: number, thickness?: number): void;
		/**
		 * Draw a box in 3d space. The box will only be visible on for the host!
		 * @param {Vector} center - The center of the box
		 * @param {Vector} extent - Maximum point of the box
		 * @param {Rotator} orientation - The rotation of the box
		 * @param {Color} color - Color of the box. Alpha value is not used.
		 * @param {number} duration - Amount of time in seconds to show the box. Can be 0 to show for one frame only.
		 * @param {number} thickness - Thickness of the lines. One pixel thick if 0, cm thickness for values > 0.
		*/
		drawDebugBox(center: Vector | [x: number, y: number, z: number], extent: Vector | [x: number, y: number, z: number], orientation: Rotator | [pitch: number, yaw: number, roll: number], color: Color | [r: number, g: number, b: number, a: number], duration: number, thickness?: number): void;
		/**
		 * Create a new zone with default parameters and 1cm edge length
		 * @param {Vector} position - The position of the new zone
		*/
		createZone(position: Vector | [x: number, y: number, z: number]): Zone;
		/**
		 * Create a new static object from a table template
		 * @param {string} templateId - Template GUID for the new table object
		 * @param {Vector} position - Starting position
		*/
		createTableFromTemplate(templateId: string, position: Vector | [x: number, y: number, z: number]): StaticObject | undefined;
		/**
		 * Create a new object from a JSON string. Can create static objects or game objects.
		 * @param {string} jsonString - String containing Json representation of an object (can be obtained by calling toJSONString() on an object)
		 * @param {Vector} position - Starting position
		*/
		createStaticObjectFromJSON(jsonString: string, position: Vector | [x: number, y: number, z: number]): StaticObject | undefined;
		/**
		 * Create a new object from a template
		 * @param {string} templateId - Template GUID for the new object
		 * @param {Vector} position - Starting position
		*/
		createObjectFromTemplate(templateId: string, position: Vector | [x: number, y: number, z: number]): GameObject | undefined;
		/**
		 * Create a new object from a JSON string
		 * @param {string} jsonString - String containing Json representation of an object (can be obtained by calling toJSONString() on an object)
		 * @param {Vector} position - Starting position
		*/
		createObjectFromJSON(jsonString: string, position: Vector | [x: number, y: number, z: number]): GameObject | undefined;
		/**
		 * Create a new label with default parameters
		 * @param {Vector} position - The position of the new label
		*/
		createLabel(position: Vector | [x: number, y: number, z: number]): Label;
		/**
		 * Clear the built-in JavaScript console. The same effect can be achieved by entering "clear()" in the console.
		*/
		clearConsole(): void;
		/**
		 * Find all objects hits with a capsule that is moved along a line, ordered by distance to start
		 * @param {Vector} start - Starting point of the capsule
		 * @param {Vector} end - End point of the capsule movement
		 * @param {Vector} extent - Dimensions of the capsule
		 * @param {Rotator} orientation - Orientation of the capsule
		*/
		capsuleTrace(start: Vector | [x: number, y: number, z: number], end: Vector | [x: number, y: number, z: number], extent: Vector | [x: number, y: number, z: number], orientation?: Rotator | [pitch: number, yaw: number, roll: number]): TraceHit[];
		/**
		 * Find all objects that would collide with a capsule
		 * @param {Vector} position - Center of the capsule
		 * @param {Vector} extent - Dimensions of the capsule (from center to one of the corners of the surrounding box)
		 * @param {Rotator} orientation - Orientation of the capsule
		*/
		capsuleOverlap(position: Vector | [x: number, y: number, z: number], extent: Vector | [x: number, y: number, z: number], orientation?: Rotator | [pitch: number, yaw: number, roll: number]): GameObject[];
		/**
		 * Send a chat message to all players
		 * @param {string} slot - Message to send
		 * @param {Color} slot - Color of the message
		*/
		broadcastChatMessage(message: string, color?: Color | [r: number, g: number, b: number, a: number]): void;
		/**
		 * Find all object hits with a box that is moved along a line, ordered by distance to start
		 * @param {Vector} start - Starting point of the box
		 * @param {Vector} end - End point of box movement
		 * @param {Vector} extent - Dimensions of the box (from center to on of the corners)
		 * @param {Rotator} orientation - Orientation of the box
		*/
		boxTrace(start: Vector | [x: number, y: number, z: number], end: Vector | [x: number, y: number, z: number], extent: Vector | [x: number, y: number, z: number], orientation?: Rotator | [pitch: number, yaw: number, roll: number]): TraceHit[];
		/**
		 * Find all objects that would collide with a box
		 * @param {Vector} position - Center of the box
		 * @param {Vector} extent - Dimensions of the box (from center to on of the corners)
		 * @param {Rotator} orientation - Orientation of the box
		*/
		boxOverlap(position: Vector | [x: number, y: number, z: number], extent: Vector | [x: number, y: number, z: number], orientation?: Rotator | [pitch: number, yaw: number, roll: number]): GameObject[];
		/**
		 * Add a new global UI element in the world
		 * @param {UIElement} element - The UI element to add
		 * @returns {number} - The index of the added UI element
		*/
		addUI(element: UIElement): number;
		/**
		 * Add a new global UI element in the world
		 * @param {UIElement} element - The UI element to add
		 * @returns {number} - The index of the added UI element
		*/
		addScreenUI(element: ScreenUIElement): number;
		/**
		 * Add a drawn line to the table. Does not work if no table exists.
		 * Returns whether the line was added successfully. It can't be added if no table exists,
		 * if the {@link DrawingLine} is invalid, or if there are already too many lines drawn on
		 * the table and the new line would go beyond the limit.
		*/
		addDrawingLine(line: DrawingLine): boolean;
		/**
		 * Add a custom action that appears in the global context menu (right click menu when not clicking on an object).
		 * @param {string} name - The name for the action in the context menu
		 * @param {string} tooltip - The tooltip text to show for the custom action
		 * @param {string} identifier - An identifier passed to the onCustomAction event if you don't want to use the action
		 * name to identify what action is executed. If empty, the action name is used as identifier.
		*/
		addCustomAction(name: string, tooltip?: string, identifier?: string): void;
	}

	/**
	 * Global scripting event callbacks
	*/
	class GlobalScriptingEvents { 
		/**
		 * Called every tick.
		 * @param {number} seconds - Duration of the previous tick
		*/
		onTick: MulticastDelegate<(milliseconds: number) => void>;
		/**
		 * Called when a player presses a script action button. Per default, the script buttons are mapped to the numpad.
		 * Players can re-assign them in the interface settings.
		 * @param {Player} player - Player that pressed the button
		 * @param {number} index - Index of the action (1-10)
		 * @param {boolean} ctrl - Whether the ctrl key was held when the player pressed the button
		 * @param {boolean} alt - Whether the alt key was held when the player pressed the button
		*/
		onScriptButtonPressed: MulticastDelegate<(player: Player, index: number, ctrl: boolean, alt: boolean) => void>;
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
		 * Called when a player sends a team chat message
		 * @param {Player} sender - Player that sent the message
		 * @param {number} team - The index of the team where the message was sent (1-8)
		 * @param {string} message - The chat message
		*/
		onTeamChatMessage: MulticastDelegate<(sender: Player, team: number, message: string) => void>;
		/**
		 * Called when a player whispers (sends a direct message) to another player
		 * @param {Player} sender - Player that sent the message
		 * @param {Player} recipient - Player that received the message
		 * @param {string} message - The message
		*/
		onWhisper: MulticastDelegate<(sender: Player, recipient: Player, message: string) => void>;
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
		 * @param {number} oldSlot - Previous player slot
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
		 * Called when a player has shaken the mouse (or motion controller) while holding objects.
		 * @param {Player} player - Shaking player
		 * @param {GameObject[]} objects - Array of held objects
		*/
		onShake: MulticastDelegate<(player: Player, objects: GameObject[]) => void>;
		/**
		 * Called when a player has rolled dice, once the dice have come to rest. Called directly before the dice roll message is sent,
		 * so you can use {@link GameWorld.setShowDiceRollMessages} to determine whether the regular message should be sent.
		 * @param {Player} player - Player that rolled the dice
		 * @param {Dice[]} dice - Array of Dice objects that were rolled
		*/
		onDiceRolled: MulticastDelegate<(player: Player, dice: Dice[]) => void>;
		/**
		 * Called when a player has finished drawing a line. A line is finished when the player releases the mouse button or moves the mouse
		 * to another object. A line is also finished when it exceeds 1000 points, in that case a new line is started immediately at the
		 * point where the old line finished, usually without the player noticing.
		 * @param {Player} player - Player that drew the line
		 * @param {GameObject} object - The object on which the line was drawn. undefined when the line was drawn directly on the table.
		 * @param {DrawingLine} line - Information about the line
		*/
		onLineDrawn: MulticastDelegate<(player: Player, object: GameObject, line: DrawingLine) => void>;
		/**
		 * Called when a player has erased a line.
		 * @param {Player} player - Player that erased the line
		 * @param {GameObject} object - The object on which the erased line was drawn. undefined when the line was drawn directly on the table.
		 * @param {DrawingLine} line - Information about the erased line
		*/
		onLineErased: MulticastDelegate<(player: Player, object: GameObject, line: DrawingLine) => void>;
		/**
		 * Called when a player has called a custom action from the global context menu (defined through {@link GameWorld.addCustomAction})
		 * @param {Player} player - Player that called the action
		 * @param {string} identifier - The identifier of the executed action
		*/
		onCustomAction: MulticastDelegate<(player: Player, identifier: string) => void>;
		/**
		 * Called when a new allowed package was added to the session. Not called after loading for packages that are part of a loaded save state.
		 * @param {Package} package - The newly added package
		*/
		onPackageAdded: MulticastDelegate<(package: Package) => void>;
	}

	/**
	 * An HTTP request. For most purposes, {@link fetch} will be easier to use, but you can use this class when
	 * you want to check progress of a request while it is running (using {@link onProgress}).
	*/
	class HttpRequest { 
		/**
		 * Called when an HTTP request completes
		 * @param {boolean} success - Indicates whether or not the request was able to connect successfully
		*/
		onComplete: Delegate<(success: boolean) => void>;
		/**
		 * Delegate called per tick to update an HTTP request upload or download size progress
		 * @param {number} sent - The number of bytes uploaded in the request so far
		 * @param {number} received - The number of bytes downloaded in the response so far
		*/
		onProgress: Delegate<(sent: number, received: number) => void>;
		/**
		 * Set the URL for the request (e.g. https://postman-echo.com/get?foo1=bar1&foo2=bar2)
		 * Must be set before calling {@link process}.
		 * @param {string} url - URL to use
		*/
		setURL(url: string): void;
		/**
		 * Set the method used by the request. Allowed methods are GET, PUT, POST, and DELETE.
		 * Should be set before calling {@link process}. If not specified, GET is assumed.
		 * @param {string} verb - Method to use
		*/
		setMethod(verb: string): void;
		/**
		 * Set optional header info. Content-Length is the only header automatically set for you.
		 * Required headers depend on the request itself, e.g. "multipart/form-data" is needed for a form post.
		 * @param {string} headerName - Name of the header (Content-Type)
		 * @param {string} headerValue - Value of the header
		*/
		setHeader(headerName: string, headerValue: string): void;
		/**
		 * Set the content of the request as a string encoded as UTF8.
		 * @param {string} contentString - Payload to set.
		*/
		setContent(contentString: string): void;
		/**
		 * Call to begin processing the request. A request object can be re-used but not while still being processed.
		*/
		process(): void;
		/**
		 * Return the current status of the request being processed.
		 * @returns {string} - The current status. Possible values: NotStarted, Processing, Failed, Succeeded
		*/
		getStatus(): string;
		/**
		 * Return the HTTP response status code returned by the requested server.
		 * @returns {number} - The response code
		*/
		getResponseCode(): number;
		/**
		 * Return the method (GET, PUT, POST, DELETE) used by the request.
		 * @returns {string} - The method used
		*/
		getMethod(): string;
		/**
		 * Return the time that it took for the server to fully respond to the request.
		 * @returns {number} - Elapsed time in seconds
		*/
		getElapsedTime(): number;
		/**
		 * Return the size of the payload.
		 * @returns {number} - The payload size in bytes
		*/
		getContentLength(): number;
		/**
		 * Return the payload as a string, assuming the payload is UTF8.
		 * @returns {string} - The payload as a string.
		*/
		getContent(): string;
		/**
		 * Cancel a request that is still being processed
		*/
		cancel(): void;
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

	/**
	 * A colored border (and background) around another widget
	*/
	class Border extends Widget { 
		/**
		 * Set the background color of the border
		*/
		setColor(color: Color | [r: number, g: number, b: number, a: number]): Border;
		/**
		 * Set the child widget. You can pass undefined to remove an existing child widget.
		*/
		setChild(child?: Widget): Border;
		/**
		 * Return the current background color
		*/
		getColor(): Color;
		/**
		 * Return the child widget. Returns undefined if no child has been set for this border
		*/
		getChild(): Widget | undefined;
	}

	/**
	 * Base class for widgets that include text. Provides methods to change the appearance of the text.
	 * Doesn't have functionality by itself, use subclasses instead.
	*/
	class TextWidgetBase extends Widget { 
		/**
		 * Set the color of the text
		*/
		setTextColor(color: Color | [r: number, g: number, b: number, a: number]): this;
		/**
		 * Set if the text is italic
		*/
		setItalic(italic: boolean): this;
		/**
		 * Set the font size.
		 * @param {number} size - The new font size. Default: 12
		*/
		setFontSize(size: number): this;
		/**
		 * Set the TrueType font file used for the text. If a custom font is used, the bold and italic
		 * settings don't have an effect. Place your font files in the "Fonts" folder of your package.
		 * @param {string} fontFilename - The filename of the TTF file to load. Set to empty string
		 * to use the standard font (and enable bold and italic settings).
		 * @param {string} packageId - The id of the package that contains the TTF file (in the
		 * Fonts folder). Can usually be empty when used from scripts to use the same package
		 * that contains the script file, but you need to explicitly pass {@link refPackageId} for
		 * the current package or a package id when you use it in a callback. You can find package
		 * ids in the manifest.json file in package folders. Usually you won't use this parameter,
		 * unless you have a specific reason to load a font from a different package than where
		 * the script is located.
		*/
		setFont(fontFilename: string, packageId?: string): this;
		/**
		 * Set if the text is bold
		*/
		setBold(bold: boolean): this;
		/**
		 * Return if the text is italic
		*/
		isItalic(): boolean;
		/**
		 * Return if the text is bold
		*/
		isBold(): boolean;
		/**
		 * Return the color of the text
		*/
		getTextColor(): Color;
		/**
		 * Return the font size
		*/
		getFontSize(): number;
		/**
		 * Return the id of the package that contains the TrueType font file name used for the text. Empty if no custom font is used
		 * or no package is specified (and the package containing the script is used).
		*/
		getFontPackageId(): string;
		/**
		 * Return the TrueType font file name used for the text. Empty if no custom font is used.
		*/
		getFontFileName(): string;
	}

	/**
	 * A UI button displaying text.
	*/
	class Button extends TextWidgetBase { 
		/**
		 * Called when the button is clicked.
		 * @param {ScriptButton} button - The button that was clicked
		 * @param {Player} player - The player who clicked the button
		*/
		onClicked: MulticastDelegate<(button: this, player: Player) => void>;
		/**
		 * Set the text of this button.
		 * @param {string} text - The new text
		*/
		setText(text: string): Button;
		/**
		 * Set the justification (alignment) of the text
		 * @param {number} justification - The new justification, as defined by {@link TextJustification}
		*/
		setJustification(justification: number): Button;
		/**
		 * Return the currently displayed text
		*/
		getText(): string;
		/**
		 * Return the justification (alignment) of the text, as defined by {@link TextJustification}
		*/
		getJustification(): number;
	}

	/**
	 * A widget that can contain other widgets at fixed coordinates. A Canvas has no size of its own,
	 * so you need to explicitly set the widget size in the {@link UIElement} and set
	 * {@link UIElement.useWidgetSize} to false when using it. Widget coordinates are in pixels, at
	 * default scale one pixel corresponds to 1 mm in the game world. <br>
	 * Usually you'll use a Canvas as the top widget in a {@link UIElement} or {@link ScreenUIElement},
	 * but you can also use it as a child of other widgets. In particular, using a Canvas inside of
	 * a {@link LayoutBox} with an override size inside of a layout where widget size is automatic
	 * (for example in a {@link VerticalBox}) can be useful.
	*/
	class Canvas extends Widget { 
		/**
		 * Update coordinates of a child widget of the canvas. Will not do anything if called with a widget
		 * that is not a child of the canvas.
		 * @param {Widget} child - The widget to add
		 * @param {number} x - The X coordinate in pixels. Can be undefined to keep the current X coordinate.
		 * @param {number} y - The Y coordinate in pixels. Can be undefined to keep the current Y coordinate.
		 * @param {number} width - Width of the widget on the canvas in pixels. Can be undefined to keep the
		 * current width.
		 * @param {number} height - Height of the widget on the canvas in pixels. Can be undefined to keep the
		 * current height.
		*/
		updateChild(child: Widget, x: number, y: number, width: number, height: number): void;
		/**
		 * Remove the given child from the canvas
		 * @param {Widget} child - The widget to remove
		*/
		removeChild(child: Widget): void;
		/**
		 * Return all child widgets of the canvas
		*/
		getChildren(): Widget[];
		/**
		 * Add a child widget to the canvas.
		 * @param {Widget} child - The widget to add
		 * @param {number} x - The X coordinate in pixels
		 * @param {number} y - The Y coordinate in pixels
		 * @param {number} width - Width of the widget on the canvas in pixels
		 * @param {number} height - Height of the widget on the canvas in pixels
		*/
		addChild(child: Widget, x: number, y: number, width: number, height: number): Canvas;
	}

	/**
	 * Check box UI element
	*/
	class CheckBox extends TextWidgetBase { 
		/**
		 * Called when the check state changes.
		 * @param {Checkbox} checkBox - The check box for which the state changed.
		 * @param {Player} player - The player who initiated the change. undefined if the state was changed through {@link setIsChecked}.
		 * @param {boolean} isChecked - The new check state of the check box.
		*/
		onCheckStateChanged: MulticastDelegate<(checkBox: this, player: Player, isChecked: boolean) => void>;
		/**
		 * Set the displayed text. Can include "\n" to indicate new lines.
		 * @param {string} text - The new text
		*/
		setText(text: string): CheckBox;
		/**
		 * Set whether the check box is currently checked
		 * @param {boolean} checked - The new checked state
		*/
		setIsChecked(checked: boolean): CheckBox;
		/**
		 * Set whether the background is transparent. Can be used to show a custom check box background using an {@link ImageWidget}
		 * behind the CheckBox on a {@link Canvas}, for example.
		 * @param {boolean} transparent - Set to true to remove the text box background and only show the text
		*/
		setBackgroundTransparent(transparent: boolean): CheckBox;
		/**
		 * Return whether the check box is currently checked
		*/
		isChecked(): boolean;
		/**
		 * Return if the background is transparent
		*/
		isBackgroundTransparent(): boolean;
		/**
		 * Return the currently displayed text.
		*/
		getText(): string;
	}

	/**
	 * A UI button with a child widget
	*/
	class ContentButton extends Widget { 
		/**
		 * Called when the button is clicked.
		 * @param {ScriptButton} button - The button that was clicked
		 * @param {Player} player - The player who clicked the button
		*/
		onClicked: MulticastDelegate<(button: this, player: Player) => void>;
		/**
		 * Set the child widget. You can pass undefined to remove an existing child widget.
		*/
		setChild(child?: Widget): ContentButton;
		/**
		 * Return the child widget. Returns undefined if no child has been set for this border
		*/
		getChild(): Widget | undefined;
	}

	/**
	 * Superclass for UI widgets that contain multiple other UI widgets in a list. Doesn't have functionality by itself, use subclasses instead.
	*/
	class Panel extends Widget { 
		/**
		 * Set the vertical alignment of widgets in the panel, as defined by {@link VerticalAlignment}. Default: Fill
		*/
		setVerticalAlignment(alignment: number): Panel;
		/**
		 * Set the horizontal alignment of widgets in the panel, as defined by {@link HorizontalAlignment}. Default: Fill
		*/
		setHorizontalAlignment(alignment: number): Panel;
		/**
		 * @deprecated This method doesn't do anything anymore except printing a warning. In order to control the
		 * size of the child widgets, use the weight parameter in {@link addChild} and {@link insertChild}. Setting
		 * the weight to 1 for all children has the same effect as ``setEqualChildSize(true)`` had. Setting
		 * the weight to 0 (default) has the same effect as ``setEqualChildSize(false)``, which was the default.
		*/
		setEqualChildSize(equal: boolean): Panel;
		/**
		 * Set distance (margin) between child widgets.
		 * @param {number} distance - Widget distance. Default: 1
		*/
		setChildDistance(distance: number): Panel;
		/**
		 * Remove the child widget at the given index
		 * @param {number} index - Index where to remove the child widget
		*/
		removeChildAt(index: number): void;
		/**
		 * Remove the given child widget
		 * @param {Widget} child - The widget to remove
		*/
		removeChild(child: Widget): void;
		/**
		 * Remove all child widgets
		*/
		removeAllChildren(): void;
		/**
		 * Insert a child widget at the given index. Inserts at the end if the index is not valid.
		 * @param {Widget} child - The widget to insert
		 * @param {number} index - Index at which to insert the new child
		 * @param {number} weight - The amount of space the widget gets. 0 means as much as the widget requires, values above 0
		 * give a weight compared to all other widgets with a weight above 0. Default: 0
		*/
		insertChild(child: Widget, index: number, weight?: number): Panel;
		/**
		 * Return the vertical alignment of widgets in the panel, as defined by {@link VerticalAlignment}. Default: Fill
		*/
		getVerticalAlignment(): number;
		/**
		 * Return the number of child widgets
		*/
		getNumChildren(): number;
		/**
		 * Return the horizontal alignment of widgets in the panel, as defined by {@link HorizontalAlignment}. Default: Fill
		*/
		getHorizontalAlignment(): number;
		/**
		 * Return the child widget at the given index. Returns undefined if no child exists at the index.
		 * @param {number} index - Index where to get the child widget
		*/
		getChildAt(index: number): Widget | undefined;
		/**
		 * Return an array with all child widgets
		*/
		getAllChildren(): Widget[];
		/**
		 * Add a child widget at the end
		 * @param {Widget} child - The widget to add
		 * @param {number} weight - The amount of space the widget gets. 0 means as much as the widget requires, values above 0
		 * give a weight compared to all other widgets with a weight above 0. Default: 0
		*/
		addChild(child: Widget, weight?: number): Panel;
	}

	/**
	 * A widget that contains other widgets and orders its children horizontally
	*/
	class HorizontalBox extends Panel { 
	}

	/**
	 * Image element. Can use a local image file in a package, an online URL, or a card on the table as source for the image.
	*/
	class ImageWidget extends Widget { 
		/**
		 * Called when an image set by {@link setImage} or {@link setImageURL} is done loading.
		 * This will be within the call if the image is already cached, or some time
		 * later if the image has to be loaded first. Called with an empty filename the image
		 * could not be loaded.
		 * Note that if you call set the image before setting this callback, it might not get
		 * called because the image has been loaded instantly if it was cached.
		*/
		onImageLoaded: MulticastDelegate<(UImage: this, filename: string, packageId: string) => void>;
		/**
		 * Set the tint color of the image. Default: White
		*/
		setTintColor(color: Color | [r: number, g: number, b: number, a: number]): ImageWidget;
		/**
		 * Set the displayed image based on a card. The image file width will always be 128, the file height
		 * is calculated based on the aspect ratio of the card. Note that if the card is deleted or becomes
		 * part of another stack, the image widget will become empty when it is reloaded, for example because
		 * the containing UI is changed or for a new player who joins.
		 * @param {Card} sourceCard - The card that should be displayed on the widget.
		*/
		setSourceCard(sourceCard: Card): ImageWidget;
		/**
		 * Set the displayed image file from a URL
		 * @param {string} url - The filename of the image to load
		*/
		setImageURL(url: string): ImageWidget;
		/**
		 * Set the desired size of the image. If both axes are set to 0, the size will be the actual size of the image file.
		 * If only one axis is set to 0, it will be set to a value that preserves the aspect ratio of the image, and the
		 * other value above 0 will be fixed. Desired size can get overridden by the widget size on a {@link Canvas}
		 * or the size of the {@link UIElement} when the image is the only widget and {@link UIElement.useWidgetSize} is false.
		 * @param {number} width - Desired width of the image. Default: 0
		 * @param {number} height - Desired height of the image. Default: 0
		*/
		setImageSize(width?: number, height?: number): ImageWidget;
		/**
		 * Set the displayed image file. When an image is used for the first time, it is loaded
		 * in the background and won't be visible immediately. {@link onImageLoaded} is called when
		 * the image is loaded.
		 * @param {string} textureName - The filename of the image to load
		 * @param {string} packageId - The id of the package that contains the image file (in the
		 * Textures folder). Can usually be empty when used from scripts to use the same package
		 * that contains the script file, but you need to explicitly pass {@link refPackageId} for
		 * the current package or a package id when you use it in a callback. You can find package
		 * ids in the manifest.json file in package folders. Usually you won't use this parameter,
		 * unless you have a specific reason to load an image from a different package than where
		 * the script is located.
		*/
		setImage(textureName: string, packageId?: string): ImageWidget;
		/**
		 * Return the current tint color of the image
		*/
		getTintColor(): Color;
		/**
		 * Get the desired width of the image, as set by {@link setImageSize}
		*/
		getImageWidth(): number;
		/**
		 * Return the currently configured image URL. Empty string if no URL is used
		 * @param {string} url - The filename of the image to load
		*/
		getImageURL(): string;
		/**
		 * Get the desired width of the image, as set by {@link setImageSize}
		*/
		getImageHeight(): number;
		/**
		 * Get the width of the displayed image file. Does not have to be identical to the desired width of the image,
		 * use {@link getImageWidth} for that. Returns 0 if no image has been set or it hasn't been loaded yet.
		 * Wait for {@link onImageLoaded} before using this method to ensure that the size from the loaded file is available.
		*/
		getImageFileWidth(): number;
		/**
		 * Get the height of the displayed image file. Does not have to be identical to the desired height of the image,
		 * use {@link getImageHeight} for that. Returns 0 if no image has been set or it hasn't been loaded yet.
		 * Wait for {@link onImageLoaded} before using this method to ensure that the size from the loaded file is available.
		*/
		getImageFileHeight(): number;
	}

	/**
	 * A UI button displaying an image.
	*/
	class ImageButton extends Widget { 
		/**
		 * Called when the button is clicked.
		 * @param {ScriptButton} button - The button that was clicked
		 * @param {Player} player - The player who clicked the button
		*/
		onClicked: MulticastDelegate<(button: this, player: Player) => void>;
		/**
		 * Called when an image set by {@link setImage} or {@link setImageURL} is done loading.
		 * This will be within the call if the image is already cached, or some time
		 * later if the image has to be loaded first. Not called if the image can't be loaded.
		 * Note that if you call set the image before setting this callback, it might not get
		 * called because the image has been loaded instantly if it was cached.
		*/
		onImageLoaded: MulticastDelegate<(UImage: this, filename: string, packageId: string) => void>;
		/**
		 * Set the tint color of the image. Default: White
		*/
		setTintColor(color: Color | [r: number, g: number, b: number, a: number]): ImageButton;
		/**
		 * Set the displayed image based on a card. The image file width will always be 128, the file height
		 * is calculated based on the aspect ratio of the card. Note that if the card is deleted or becomes
		 * part of another stack, the image widget will become empty when it is reloaded, for example because
		 * the containing UI is changed or for a new player who joins.
		 * @param {Card} sourceCard - The card that should be displayed on the widget.
		*/
		setSourceCard(sourceCard: Card): ImageButton;
		/**
		 * Set the displayed image file from a URL
		 * @param {string} url - The filename of the image to load
		*/
		setImageURL(url: string): ImageButton;
		/**
		 * Set the desired size of the image. If both axes are set to 0, the size will be the actual size of the image file.
		 * If only one axis is set to 0, it will be set to a value that preserves the aspect ratio of the image, and the
		 * other value above 0 will be fixed. Desired size can get overridden by the widget size on a {@link Canvas}
		 * or the size of the {@link UIElement} when the image is the only widget and {@link UIElement.useWidgetSize} is false.
		 * The button has two pixels of padding around the image on all sides, so the total size of the button will be four pixels
		 * larger on each axis.
		 * @param {number} width - Desired width of the image. Default: 0
		 * @param {number} height - Desired height of the image. Default: 0
		*/
		setImageSize(width?: number, height?: number): ImageButton;
		/**
		 * Set the displayed image file. When an image is used for the first time, it is loaded
		 * in the background and won't be visible immediately. {@link onImageLoaded} is called when
		 * the image is loaded.
		 * @param {string} textureName - The filename of the image to load
		 * @param {string} packageId - The id of the package that contains the image file (in the
		 * Textures folder). Can usually be empty when used from scripts to use the same package
		 * that contains the script file, but you need to explicitly pass {@link refPackageId} for
		 * the current package or a package id when you use it in a callback. You can find package
		 * ids in the manifest.json file in package folders. Usually you won't use this parameter,
		 * unless you have a specific reason to load an image from a different package than where
		 * the script is located.
		*/
		setImage(textureName: string, packageId?: string): ImageButton;
		/**
		 * Return the current tint color of the image
		*/
		getTintColor(): Color;
		/**
		 * Get the desired width of the image, as set by {@link setImageSize}
		*/
		getImageWidth(): number;
		/**
		 * Get the desired width of the image, as set by {@link setImageSize}
		*/
		getImageHeight(): number;
		/**
		 * Get the width of the displayed image file. Does not have to be identical to the desired width of the image,
		 * use {@link getImageWidth} for that. Returns 0 if no image has been set or it hasn't been loaded yet.
		 * Wait for {@link onImageLoaded} before using this method to ensure that the size from the loaded file is available.
		*/
		getImageFileWidth(): number;
		/**
		 * Get the height of the displayed image file. Does not have to be identical to the desired height of the image,
		 * use {@link getImageHeight} for that. Returns 0 if no image has been set or it hasn't been loaded yet.
		 * Wait for {@link onImageLoaded} before using this method to ensure that the size from the loaded file is available.
		*/
		getImageFileHeight(): number;
	}

	/**
	 * An invisible element that contains another widget and adds size and layout information. The size properties
	 * do not have an effect when the LayoutBox is placed directly on a {@link Canvas}, because the size is already
	 * fixed by the coordinates on the Canvas.
	*/
	class LayoutBox extends Widget { 
		/**
		 * Set the vertical alignment of the child widget within the LayoutBox, as defined by {@link VerticalAlignment}. Default: Fill
		*/
		setVerticalAlignment(alignment: number): LayoutBox;
		/**
		 * Set how many pixels of padding to add around the child widget. No padding is added by default.
		 * You can use negative values to grow the widget beyond it's allotted size, or to reduce padding
		 * within parent widgets (like a {@link ContentButton}).
		 * @param {number} left - Padding on the left of the child widget. Default: 0
		 * @param {number} right - Padding on the right of the child widget. Default: 0
		 * @param {number} top - Padding above the child widget. Default: 0
		 * @param {number} bottom - Padding below the child widget. Default: 0
		*/
		setPadding(left?: number, right?: number, top?: number, bottom?: number): LayoutBox;
		/**
		 * Set the exact width that this box should get. Use a negative value to disable the override (disabled by default).
		*/
		setOverrideWidth(override: number): LayoutBox;
		/**
		 * Set the exact height that this box should get. Use a negative value to disable the override (disabled by default).
		*/
		setOverrideHeight(override: number): LayoutBox;
		/**
		 * Set the minimum width that this box should get (0 by default).
		*/
		setMinimumWidth(minimum: number): LayoutBox;
		/**
		 * Set the minimum height that this box should get (0 by default).
		*/
		setMinimumHeight(minimum: number): LayoutBox;
		/**
		 * Set the maximum width that this box should get. Use a negative value to disable the maximum (disabled by default).
		*/
		setMaximumWidth(maximum: number): LayoutBox;
		/**
		 * Set the maximum height that this box should get. Use a negative value to disable the maximum (disabled by default).
		*/
		setMaximumHeight(maximum: number): LayoutBox;
		/**
		 * Set the horizontal alignment of the child widget within the LayoutBox, as defined by {@link HorizontalAlignment}. Default: Fill
		*/
		setHorizontalAlignment(alignment: number): LayoutBox;
		/**
		 * Set the child widget. You can pass undefined to remove an existing child widget.
		*/
		setChild(child?: Widget): LayoutBox;
		/**
		 * Return the vertical alignment of the child widget within the LayoutBox, as defined by {@link VerticalAlignment}
		*/
		getVerticalAlignment(): number;
		/**
		 * Return the number of padding pixels on the left of the child widget
		*/
		getTopPadding(): number;
		/**
		 * Return the number of padding pixels on the left of the child widget
		*/
		getRightPadding(): number;
		/**
		 * Return the exact width that this box should get. Returns -1 if no override is set.
		*/
		getOverrideWidth(): number;
		/**
		 * Return the exact height that this box should get. Returns -1 if no override is set.
		*/
		getOverrideHeight(): number;
		/**
		 * Return the minimum width that this box should get.
		*/
		getMinimumWidth(): number;
		/**
		 * Return the minimum height that this box should get.
		*/
		getMinimumHeight(): number;
		/**
		 * Return the maximum width that this box should get. Returns -1 if no maximum is set.
		*/
		getMaximumWidth(): number;
		/**
		 * Return the maximum height that this box should get. Returns -1 if no maximum is set.
		*/
		getMaximumHeight(): number;
		/**
		 * Return the number of padding pixels on the left of the child widget
		*/
		getLeftPadding(): number;
		/**
		 * Return the horizontal alignment of the child widget within the LayoutBox, as defined by {@link HorizontalAlignment}
		*/
		getHorizontalAlignment(): number;
		/**
		 * Return the child widget. Returns undefined if no child has been set for this LayoutBox
		*/
		getChild(): Widget | undefined;
		/**
		 * Return the number of padding pixels on the left of the child widget
		*/
		getBottomPadding(): number;
	}

	/**
	 * An editable text box UI element
	*/
	class MultilineTextBox extends TextWidgetBase { 
		/**
		 * Called when the edited text changes.
		 * @param {MultilineTextBox} textBox - The text box where the text changed
		 * @param {Player} player - The player that changed the text. undefined if the text was changed through {@link setText}.
		 * @param {string} text - The new text
		*/
		onTextChanged: MulticastDelegate<(textBox: this, player: Player, text: string) => void>;
		/**
		 * Called when the edited text is committed by deselecting the widget.
		 * @param {MultilineTextBox} textBox - The text box where the text was committed
		 * @param {Player} player - The player that committed the text. undefined if the text was committed through {@link setText}.
		 * @param {string} text - The new text
		*/
		onTextCommitted: MulticastDelegate<(textBox: this, player: Player, text: string) => void>;
		/**
		 * Set the edited text.
		 * @param {string} text - The new text
		*/
		setText(text: string): MultilineTextBox;
		/**
		 * Set the maximum number of characters allowed for this text box
		 * @param {number} length - Maximum number of characters. Must be between 1 and 2000. Default: 200
		*/
		setMaxLength(length: number): MultilineTextBox;
		/**
		 * Set whether the background is transparent. Can be used to show a custom text box style using an {@link ImageWidget}
		 * behind the TextBox on a {@link Canvas}, for example.
		 * @param {boolean} transparent - Set to true to remove the text box background and only show the text
		*/
		setBackgroundTransparent(transparent: boolean): MultilineTextBox;
		/**
		 * Return if the background is transparent
		*/
		isBackgroundTransparent(): boolean;
		/**
		 * Return the currently displayed text.
		*/
		getText(): string;
		/**
		 * Return the maximum number of characters allowed for this text box
		*/
		getMaxLength(): number;
	}

	/**
	 * Progress bar UI element
	*/
	class ProgressBar extends TextWidgetBase { 
		/**
		 * Set the displayed text. Can include "\n" to indicate new lines.
		 * @param {string} text - The new text
		*/
		setText(text: string): ProgressBar;
		/**
		 * Set the displayed progressed.
		 * @param {number} progress - Progress to show. 0 is not progress, 1 shows the full bar.
		*/
		setProgress(progress: number): ProgressBar;
		/**
		 * Set the color of the progress bar
		*/
		setBarColor(barColor: Color | [r: number, g: number, b: number, a: number]): ProgressBar;
		/**
		 * Return the currently displayed text
		*/
		getText(): string;
		/**
		 * Return the currently displayed progress (0 to 1)
		*/
		getProgress(): number;
		/**
		 * Return the color of the progress bar
		*/
		getBarColor(): Color;
	}

	/**
	 * Text UI element that can process simple BBCode style markdown to control text appearance. The same tags as in the
	 * in-game notes are supported:<br>
	 * `[b]`: Bold (does not work when the widget is set to a custom font using {@link setFont})<br>
	 * `[i]`: Italic (does not work when the widget is set to a custom font using {@link setFont})<br>
	 * `[size=X]`: Control the font size<br>
	 * `[color=#RRGGBB]`: Control the text color<br><br>
	 * Tags are closed using `[/tag]`. Here's an example of a text using tags:<br>
	 * `You can use [color=#ff0000]colors[/color], [b]bold[/b] or [i]italic[/i] text, [size=9]different[/size] [size=16]sizes[/size], and [color=#00ff00][size=8][b][i]combine text styles.[/color][/size][/b][/i]`
	*/
	class RichText extends TextWidgetBase { 
		/**
		 * Set the displayed text. Can include "\n" to indicate new lines. Can include BBCode tags, see {@link RichText} for
		 * a list of supported tags.
		 * @param {string} text - The new text
		*/
		setText(text: string): RichText;
		/**
		 * Set the justification (alignment) of the text
		 * @param {number} justification - The new justification, as defined by {@link TextJustification}
		*/
		setJustification(justification: number): RichText;
		/**
		 * Set whether the text is automatically wrapped. Auto-wrapping only works when the text has a fixed width,
		 * for example in a {@link Canvas}, {@link LayoutBox}, or in an {@link UIElement} with ``useWidgetSize`` set to false.
		*/
		setAutoWrap(autoWrap: boolean): RichText;
		/**
		 * Return the currently displayed text.
		*/
		getText(): string;
		/**
		 * Return the justification (alignment) of the text, as defined by {@link TextJustification}
		*/
		getJustification(): number;
		/**
		 * Return whether the text is automatically wrapped.
		*/
		getAutoWrap(): boolean;
	}

	/**
	 * This widget offers the player a choice between different options. You usually will use this widget
	 * together with other widgets on a {@link Canvas}, it does not work well as a standalone widget
	 * directly in a {@link UIElement} because it changes size when clicked, so it needs enough space
	 * to unfold.
	*/
	class SelectionBox extends TextWidgetBase { 
		/**
		 * Called when the selection is changed.
		 * @param {SelectionBox} selectionBox - The selection box that was changed
		 * @param {Player} player - The player who changed the selection. undefined if selection is changed by {@link setSelectedOption} or {@link setSelectedIndex}.
		 * @param {Player} index - The selected index
		 * @param {Player} option - The selected option
		*/
		onSelectionChanged: MulticastDelegate<(selectionBox: this, player: Player, index: number, option: string) => void>;
		/**
		 * Set the currently selected option. Will not have an effect if no such option exists.
		*/
		setSelectedOption(text: string): SelectionBox;
		/**
		 * Set the index of the currently selected option. Will have no effect if there is no option at that index.
		*/
		setSelectedIndex(index: number): SelectionBox;
		/**
		 * Set all available options
		*/
		setOptions(options: string[]): SelectionBox;
		/**
		 * Remove an existing option. Has no effect if the option does not exist.
		*/
		removeOption(option: string): SelectionBox;
		/**
		 * Return the currently selected option
		*/
		getSelectedOption(): string;
		/**
		 * Get the index of the currently selected option. -1 if nothing is selected because this selection box has no options.
		*/
		getSelectedIndex(): number;
		/**
		 * Return all available options
		*/
		getOptions(): string[];
		/**
		 * Add an option at the end
		*/
		addOption(option: string): SelectionBox;
	}

	/**
	 * Slider UI element
	*/
	class Slider extends TextWidgetBase { 
		/**
		 * Called when the value is changed by a player
		 * @param {SelectionBox} slider - The slider that was changed
		 * @param {Player} player - The player who changed the value. undefined if the value was changed through {@link setValue}.
		 * @param {Player} index - The new value
		*/
		onValueChanged: MulticastDelegate<(slider: this, player: Player, value: number) => void>;
		/**
		 * Set the current slider value
		*/
		setValue(value: number): Slider;
		/**
		 * Set the width of the text box. Can be set to 0 to hide the text box.
		*/
		setTextBoxWidth(width: number): Slider;
		/**
		 * Set the slider step size. Default: 0.01
		*/
		setStepSize(stepSize: number): Slider;
		/**
		 * Set the minimum slider value. Default: 0
		*/
		setMinValue(minValue: number): Slider;
		/**
		 * Set the maximum slider value. Default: 1
		*/
		setMaxValue(maxValue: number): Slider;
		/**
		 * Return the current value
		*/
		getValue(): number;
		/**
		 * Return the width of the text box. Default: 35
		*/
		getTextBoxWidth(): number;
		/**
		 * Return the slider step size
		*/
		getStepSize(): number;
		/**
		 * Return the minimum slider value
		*/
		getMinValue(): number;
		/**
		 * Return the maximum slider value
		*/
		getMaxValue(): number;
	}

	/**
	 * Text UI element
	*/
	class Text extends TextWidgetBase { 
		/**
		 * Set the displayed text. Can include "\n" to indicate new lines.
		 * @param {string} text - The new text
		*/
		setText(text: string): Text;
		/**
		 * Set the justification (alignment) of the text
		 * @param {number} justification - The new justification, as defined by {@link TextJustification}
		*/
		setJustification(justification: number): Text;
		/**
		 * Set whether the text is automatically wrapped. Auto-wrapping only works when the text has a fixed width,
		 * for example in a {@link Canvas}, {@link LayoutBox}, or in an {@link UIElement} with ``useWidgetSize`` set to false.
		*/
		setAutoWrap(autoWrap: boolean): Text;
		/**
		 * Return the currently displayed text.
		*/
		getText(): string;
		/**
		 * Return the justification (alignment) of the text, as defined by {@link TextJustification}
		*/
		getJustification(): number;
		/**
		 * Return whether the text is automatically wrapped.
		*/
		getAutoWrap(): boolean;
	}

	/**
	 * An editable text box UI element
	*/
	class TextBox extends TextWidgetBase { 
		/**
		 * Called when the edited text changes.
		 * @param {TextBox} textBox - The text box where the text changed
		 * @param {Player} player - The player that changed the text. undefined if the text was changed through {@link setText}.
		 * @param {string} text - The new text
		*/
		onTextChanged: MulticastDelegate<(textBox: this, player: Player, text: string) => void>;
		/**
		 * Called when the edited text is committed (by pressing Enter or deselecting the widget).
		 * @param {TextBox} textBox - The text box where the text was committed
		 * @param {Player} player - The player that committed the text. undefined if the text was committed through {@link setText}.
		 * @param {string} text - The new text
		 * @param {boolean} usingEnter - True if the user committed the text using the enter key, false if it was committed for another
		 * reason (usually because the text field lost focus)
		*/
		onTextCommitted: MulticastDelegate<(textBox: this, player: Player, text: string, usingEnter: boolean) => void>;
		/**
		 * Set the edited text.
		 * @param {string} text - The new text
		*/
		setText(text: string): TextBox;
		/**
		 * Set whether the whole text should be selected when the TextBox receives focus
		 * @param {boolean} SelectAll - Set to true to select all text when the user clicks on the widget
		*/
		setSelectTextOnFocus(selectAll: boolean): TextBox;
		/**
		 * Set the maximum number of characters allowed for this text box
		 * @param {number} length - Maximum number of characters. Must be between 1 and 1023. Default: 100
		*/
		setMaxLength(length: number): TextBox;
		/**
		 * Set the type of input this text box accepts.
		 * 0 - Any string
		 * 1 - Real numbers, positive or negative
		 * 2 - Real numbers, positive only
		 * 3 - Whole numbers, positive or negative
		 * 4 - Whole numbers, positive only
		 * @param {number} type - The new input type
		*/
		setInputType(type: number): TextBox;
		/**
		 * Set whether the background is transparent. Can be used to show a custom text box style using an {@link ImageWidget}
		 * behind the TextBox on a {@link Canvas}, for example.
		 * @param {boolean} transparent - Set to true to remove the text box background and only show the text
		*/
		setBackgroundTransparent(transparent: boolean): TextBox;
		/**
		 * Return whether the whole text should be selected when the TextBox receives focus
		*/
		isSelectTextOnFocus(): boolean;
		/**
		 * Return if the background is transparent
		*/
		isBackgroundTransparent(): boolean;
		/**
		 * Return the currently displayed text.
		*/
		getText(): string;
		/**
		 * Return the maximum number of characters allowed for this text box
		*/
		getMaxLength(): number;
		/**
		 * Return the type of input this text box accepts.
		 * 0 - Any string
		 * 1 - Real numbers, positive or negative
		 * 2 - Real numbers, positive only
		 * 3 - Whole numbers, positive or negative
		 * 4 - Whole numbers, positive only
		*/
		getInputType(): number;
	}

	/**
	 * A widget that contains other widgets and orders its children vertically
	*/
	class VerticalBox extends Panel { 
	}

	/**
	 * A widget that embeds a web browser. This widget always captures the mouse wheel when the mouse cursor is over the browser.
	 * The keyboard is captured when clicking anywhere on the browser and released when the mouse cursor leaves the widget.
	 * Because of an issue in Unreal Engine, this widget should be used as the only widget in a {@link UIElement},
	 * otherwise the colors shown in the browser will not be correct (missing sRGB to linear color conversion).
	*/
	class WebBrowser extends Widget { 
		/**
		 * Called when the URL changes through an action (clicking on a link, going backward or forward). Not called when
		 * setting the URL through {@link setURL}.
		*/
		onURLChanged: MulticastDelegate<(browser: this, uRL: string) => void>;
		/**
		 * Called when a new document starts loading
		*/
		onLoadStarted: MulticastDelegate<(browser: this) => void>;
		/**
		 * Called when a document has finished loading
		*/
		onLoadFinished: MulticastDelegate<(browser: this, success: boolean) => void>;
		/**
		 * Stop loading the current document. Does not have an effect if the document is already loaded.
		*/
		stopLoad(): void;
		/**
		 * Set the current URL. Local URLs (file:// protocol) are not permitted.
		*/
		setURL(url: string): WebBrowser;
		/**
		 * Reload the currently shown document
		*/
		reload(): void;
		/**
		 * Return whether the browser is currently loading a document.
		*/
		isLoading(): boolean;
		/**
		 * * Go back to the next document
		*/
		goForward(): void;
		/**
		 * * Go back to the previous document
		*/
		goBack(): void;
		/**
		 * Get the current URL
		*/
		getURL(): string;
		/**
		 * Return whether the browser can currently go forward
		*/
		canGoForward(): boolean;
		/**
		 * Return whether the browser can currently go back
		*/
		canGoBack(): boolean;
	}

	/**
	 * A widget that contains other widgets and switches between them. Only one child widget is active and visible at a time.
	*/
	class WidgetSwitcher extends Widget { 
		/**
		 * * Set the currently active widget
		*/
		setActiveWidget(widget: Widget): Widget;
		/**
		 * * Set the currently active widget index
		*/
		setActiveIndex(index: number): Widget;
		/**
		 * Remove the child widget at the given index
		 * @param {number} index - Index where to remove the child widget
		*/
		removeChildAt(index: number): void;
		/**
		 * Remove the given child widget
		 * @param {Widget} child - The widget to remove
		*/
		removeChild(child: Widget): void;
		/**
		 * Remove all child widgets
		*/
		removeAllChildren(): void;
		/**
		 * Insert a child widget at the given index. Inserts at the end if the index is not valid.
		 * @param {Widget} child - The widget to insert
		 * @param {number} index - Index at which to insert the new child
		*/
		insertChild(child: Widget, index: number): WidgetSwitcher;
		/**
		 * Return the number of child widgets
		*/
		getNumChildren(): number;
		/**
		 * Return the child widget at the given index. Returns undefined if no child exists at the index.
		 * @param {number} index - Index where to get the child widget
		*/
		getChildAt(index: number): Widget | undefined;
		/**
		 * Return an array with all child widgets
		*/
		getAllChildren(): Widget[];
		/**
		 * * Return the currently active widget
		*/
		getActiveWidget(): Widget | undefined;
		/**
		 * * Return the currently active widget index. Returns -1 if there are no child widgets.
		*/
		getActiveIndex(): number;
		/**
		 * Add a child widget at the end
		 * @param {Widget} child - The widget to add
		*/
		addChild(child: Widget): WidgetSwitcher;
	}

	var globalEvents : GlobalScriptingEvents;
	var world : GameWorld;

	/** Only available in object scripts (for all object types except tables) */
	var refObject : GameObject;

	/** Only available in object scripts: Package id of the package that contains the currently executed object script*/
	var refPackageId : string;
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
	/** Only available in table object scripts */
	var refTable : StaticObject;
}
