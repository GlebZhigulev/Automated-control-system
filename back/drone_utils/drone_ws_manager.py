from fastapi import WebSocket

connected_drones = {}

async def register_drone(drone_id: str, websocket: WebSocket):
    await websocket.accept()
    connected_drones[drone_id] = websocket
    print(f"Дрон {drone_id} подключён")

async def unregister_drone(drone_id: str):
    if drone_id in connected_drones:
        del connected_drones[drone_id]
        print(f"Дрон {drone_id} отключён")