// Tipado para las propiedades de una parada (basado en tu documentación)
export interface StopProperties {
    onestop_id: string;
    stop_name: string;
    // Añade aquí otras propiedades de parada que quieras usar (stop_id, stop_code, etc.)
    [key: string]: any; // Para permitir otras propiedades no tipadas explícitamente
}
