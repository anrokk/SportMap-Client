export interface GpsLocation {
    id: string; 
    recordedAt: string; // date-time
    latitude: number | null; // double
    longitude: number | null; // double
    accuracy?: number | null; // double
    altitude?: number | null; // double
    verticalAccuracy?: number | null; // double
    appUserId: string; // uuid
    gpsSessionId: string; // uuid
    gpsLocationTypeId: string; // uuid
}

export interface GpsLocationCreate {
    recordedAt: string; // date-time
    latitude: number; // double
    longitude: number; // double
    accuracy?: number | null; // double
    altitude?: number | null; // double
    verticalAccuracy?: number | null; // double
    gpsLocationTypeId: string; // uuid
}

export interface GpsLocationCreateBulkResponse {
    locationsAdded: number; //int32
    locationsReceived: number; //int32
    gpsSessionId: string; // uuid
}

export interface GpsLocationType {
    id: string; // uuid
    name: string; // required, minlength 1
    description: string; // required, minlength 1
}

export interface GpsSession {
    id: string; // uuid
    name: string; // required maxLength 256, minLength: 1
    description: string; // required maxLength: 4096, minLength: 1
    recordedAt: string; // date-time
    duration?: number | null; // double
    speed?: number | null; // double
    distance?: number | null; // double
    climb?: number | null; // double
    descent?: number | null; // double
    paceMin?: number | null; // double
    paceMax?: number | null; // double
    gpsSessionTypeId: string; // uuid
    appUserId: string; // uuid
}

export interface GpsSessionCreate {
    name: string; // required, maxLength: 256, minLength: 2
    description: string; // required, maxLength: 4096, minLength: 2
    gpsSessionTypeId: string; // uuid, required
    recordedAt?: string | null; // date-time, nullable: true
    paceMin?: number | null; // double, nullable: true
    paceMax?: number | null; // double, nullable: true
}

export interface GpsSessionType {
    id: string; // uuid
    name: string; // required, minLength: 1
    description: string; // required, minLength: 1
    paceMin?: number | null; // int32
    paceMax?: number | null; // int32
}

export interface GpsSessionUpdate {
    id: string; // uuid
    name: string; // required, maxLength: 256, minLength: 1
    description: string; // required, maxLength: 4096, minLength: 1
    recordedAt: string; // date-time, required
    paceMin: number; // double, required
    paceMax: number; // double, required
    gpsSessionTypeId: string; // uuid, required
}

export interface GpsSessionView {
    id: string; // uuid
    name?: string | null;
    description?: string | null;
    recordedAt: string; // date-time
    duration?: number | null; // double
    speed?: number | null; // double
    distance?: number | null; // double
    climb?: number | null; // double
    descent?: number | null; // double
    paceMin?: number | null; // double
    paceMax?: number | null; // double
    gpsSessionType?: string | null;
    gpsLocationsCount: number; // int32
    userFirstLastName?: string | null;
}

export interface JwtResponse {
    token: string; // required, minLength: 1
    status: string; // required, minLength: 1 
    firstName: string; // required, minLength: 1
    lastName: string; // required, minLength: 1
}

// app.dto.v1.identity.login
export interface LoginCredentials {
    email: string; // email, required, maxLength: 256, minLength: 1
    password: string; // required, maxLength: 100, minLength: 6
}

// app.dto.v1.identity.register
export interface RegisterInfo {
    email: string; // email, required, maxLength: 256, minLength: 1
    password: string; // required, maxLength: 100, minLength: 6
    firstName: string; // required, maxLength: 128, minLength: 1
    lastName: string; // required, maxLength: 128, minLength: 1
}

export interface ProblemDetails {
    type?: string | null;
    title?: string | null;
    status?: number | null; // int32
    detail?: string | null;
    instance?: string | null;
    errors?: { [key: string]: string[] };
}

export interface ProblemMessagesDto { // Renamed for clarity as a DTO
    messages: string[]; // array of strings, required
}


export interface UserProfile {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
}
