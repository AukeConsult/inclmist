export interface QueryDescriptor {
    profileId?: string
    id: string,
    model?: string;
    modelId?: string;
    modelIntructions?: {
        system: string;
        files: []
    }
}
