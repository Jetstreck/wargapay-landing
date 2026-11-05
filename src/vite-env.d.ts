/// <reference types="vite/client" />

declare module '*.gltf' {
    const src: string;
    export default src;
}

declare module '*.gltf?url' {
    const src: string;
    export default src;
}

declare module '*.glb' {
    const src: string;
    export default src;
}

declare module '*.glb?url' {
    const src: string;
    export default src;
}

interface Window {
    snap?: {
        pay: (token: string, options?: {
            onSuccess?: (result: any) => void;
            onPending?: (result: any) => void;
            onError?: (result: any) => void;
            onClose?: () => void;
        }) => void;
    };
}
