export declare class HealthController {
    check(): {
        status: string;
        timestamp: string;
        service: string;
    };
    root(): {
        status: string;
        message: string;
        timestamp: string;
    };
}
