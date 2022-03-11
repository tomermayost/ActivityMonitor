import { IsNotEmpty, IsString } from "class-validator";

export class EventDto {
    timestamp: Date;
    type: String;
    page: String;
    @IsString()
    @IsNotEmpty()
    user: String;
    @IsString()
    @IsNotEmpty()
    element_id: String;
}