/**
 * @author sunag / http://www.sunag.com.br/
 */

THREE.CameraNode = function( scope, camera ) {

	THREE.TempNode.call( this, 'v3' );

	this.setScope( scope || THREE.CameraNode.POSITION );
	this.camera = camera;

	this.requestUpdate = this.camera !== undefined;

};

THREE.CameraNode.prototype = Object.create( THREE.TempNode.prototype );
THREE.CameraNode.prototype.constructor = THREE.CameraNode;

THREE.CameraNode.POSITION = 'position';
THREE.CameraNode.DEPTH = 'depth';

THREE.CameraNode.prototype.setScope = function( scope ) {

	switch ( this.scope ) {

		case THREE.CameraNode.DEPTH:

			delete this.near;
			delete this.far;

			break;

	}

	this.scope = scope;

	switch ( scope ) {

		case THREE.CameraNode.DEPTH:

			this.near = new THREE.FloatNode( camera ? camera.near : 1 );
			this.far = new THREE.FloatNode( camera ? camera.far : 1200 );

			break;

	}

};

THREE.CameraNode.prototype.getType = function( builder ) {

	switch ( this.scope ) {
		case THREE.CameraNode.DEPTH:
			return 'fv1';
	}

	return this.type;

};

THREE.CameraNode.prototype.isUnique = function( builder ) {

	switch ( this.scope ) {
		case THREE.CameraNode.DEPTH:
			return true;
	}

	return false;

};

THREE.CameraNode.prototype.isShared = function( builder ) {

	switch ( this.scope ) {
		case THREE.CameraNode.POSITION:
			return false;
	}

	return true;

};

THREE.CameraNode.prototype.generate = function( builder, output ) {

	var material = builder.material;
	var result;

	switch ( this.scope ) {

		case THREE.CameraNode.POSITION:

			result = 'cameraPosition';

			break;

		case THREE.CameraNode.DEPTH:

			builder.include( 'depthcolor' );

			result = 'depthcolor(' + this.near.build( builder, 'fv1' ) + ',' + this.far.build( builder, 'fv1' ) + ')';

			break;

	}

	return builder.format( result, this.getType( builder ), output );

};

THREE.CameraNode.prototype.updateAnimation = function( delta ) {

	switch ( this.scope ) {

		case THREE.CameraNode.DEPTH:

			this.near.number = camera.near;
			this.far.number = camera.far;

			break;

	}

};
