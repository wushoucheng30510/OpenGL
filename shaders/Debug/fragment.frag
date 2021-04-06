#version 330 compatibility

//lighting
uniform float uKa, uKd, uKs; // coefficients of each type of lighting
uniform vec3 uColor; // object color
uniform vec3 uSpecularColor;
uniform float uShininess; // specular exponent
uniform float uS0, uT0,uS1, uT1;
uniform float uCs, uCt;
uniform float uSize;
uniform bool	fragmentshader;
in vec2 vST; // texture cords
in vec3 vN; // normal vector
in vec3 vL; // vector from point to light
in vec3 vE; // vector from point to eye

void main()
{

	vec3 Normal = normalize(vN);
	vec3 Light = normalize(vL);
	vec3 Eye = normalize(vE);

	vec3 myColor = uColor;

	float d = max(dot(Normal, Light), 0.); // only do diffuse if the light can see the point
	vec3 diffuse = uKd * d * uColor;
	float s = 0.;
	if (dot(Normal, Light) > 0.) // only do specular if the light can see the point
	{
		vec3 ref = normalize(reflect(-Light, Normal));
		s = pow(max(dot(Eye, ref), 0.), uShininess);
	}
	vec3 specular = uKs * s * uSpecularColor;
	if (fragmentshader) {
		if (uS0  - uSize /2. <= vST.s && vST.s <= uS0  + uSize / 2. && vST.t <= uT0 + uCs + uSize / 2. && uT0  - uSize /2. <= vST.t)
		{
			myColor = vec3(1., 0., 0.);
		}
		if (uS1  - uSize /2. <= vST.s && vST.s <= uS1  + uSize / 2. && vST.t <= uT1 + uSize / 2. && uT1 + uCs  - uSize /2. <= vST.t)
		{
			myColor = vec3(0., 0., 1.);
		}
		if (uS1  + uCs - uSize /2. <= vST.s && vST.s <= uS1  + uSize / 2. && vST.t <= uT0 + uSize / 2. && uT0  - uSize /2. <= vST.t)
		{
			myColor = vec3(0., 1., 0.);
		}
		if (uS0  - uSize /2. <= vST.s && vST.s <= uS0 + uCs + uSize / 2. && vST.t <= uT1 + uCs + uSize / 2. && uT1  - uSize /2. <= vST.t)
		{
			myColor = vec3(0., 1., 1.);
		}

		float i = uCt;

		while (i < 1.0){
			if(i <= vST.t &&  i <= vST.s && vST.s < i+0.0001){
				myColor = vec3(1., 0., 1.);
			}
			i = i + 0.0001;
		}
		
		i = uCt;

		while (i > 0.){
			if(i >= vST.t &&  i <= vST.s && vST.s < i+0.0001){
				myColor = vec3(1., 0., 1.);
			}
			i = i - 0.0001;
		}
		
	}
	vec3 ambient = uKa * myColor;
	gl_FragColor = vec4(ambient + diffuse + specular, 1.);
}