import pytest
from fastapi.testclient import TestClient

ITEM_PAYLOAD = {
    "item_name": "Laptop",
    "description": "Dell XPS 15",
    "category": "Electronics",
    "quantity": 10,
    "price": 1299.99,
    "sku": "LT-001",
}


@pytest.fixture
def created_item(client: TestClient):
    """Create an item and return its response dict."""
    resp = client.post("/api/v1/items/", json=ITEM_PAYLOAD)
    assert resp.status_code == 201
    return resp.json()


# -- Health Check --

def test_health_check(client: TestClient):
    resp = client.get("/")
    assert resp.status_code == 200
    assert resp.json() == {"status": "ok"}


# -- Create --

def test_create_item(client: TestClient):
    resp = client.post("/api/v1/items/", json=ITEM_PAYLOAD)
    assert resp.status_code == 201
    data = resp.json()
    assert data["item_name"] == ITEM_PAYLOAD["item_name"]
    assert data["category"] == ITEM_PAYLOAD["category"]
    assert data["quantity"] == ITEM_PAYLOAD["quantity"]
    assert data["sku"] == ITEM_PAYLOAD["sku"]
    assert "id" in data
    assert "created_at" in data


def test_create_item_invalid_quantity(client: TestClient):
    """Verify Pydantic rejects negative quantity."""
    payload = {**ITEM_PAYLOAD, "quantity": -1}
    resp = client.post("/api/v1/items/", json=payload)
    assert resp.status_code == 422


def test_create_item_without_sku(client: TestClient):
    """Verify item can be created without SKU (optional field)."""
    payload = {**ITEM_PAYLOAD, "sku": None}
    resp = client.post("/api/v1/items/", json=payload)
    assert resp.status_code == 201
    data = resp.json()
    assert data["sku"] is None


# -- Read (list) --

def test_list_items_empty(client: TestClient):
    resp = client.get("/api/v1/items/")
    assert resp.status_code == 200
    data = resp.json()
    assert data["items"] == []
    assert data["total"] == 0
    assert data["skip"] == 0


def test_list_items(created_item, client: TestClient):
    resp = client.get("/api/v1/items/")
    assert resp.status_code == 200
    data = resp.json()
    assert len(data["items"]) == 1
    assert data["total"] == 1
    assert data["skip"] == 0
    assert data["items"][0]["item_name"] == ITEM_PAYLOAD["item_name"]
    assert data["items"][0]["sku"] == ITEM_PAYLOAD["sku"]


def test_list_items_pagination(created_item, client: TestClient):
    # Create a second item
    second = {**ITEM_PAYLOAD, "item_name": "Mouse", "price": 24.99}
    resp = client.post("/api/v1/items/", json=second)
    assert resp.status_code == 201

    resp = client.get("/api/v1/items/?skip=1&limit=1")
    assert resp.status_code == 200
    data = resp.json()
    assert len(data["items"]) == 1
    assert data["total"] == 2
    assert data["skip"] == 1
    assert data["limit"] == 1
    assert data["items"][0]["item_name"] == "Mouse"


# -- Read (single) --

def test_get_item(created_item, client: TestClient):
    item_id = created_item["id"]
    resp = client.get(f"/api/v1/items/{item_id}")
    assert resp.status_code == 200
    assert resp.json()["id"] == item_id


def test_get_item_not_found(client: TestClient):
    resp = client.get("/api/v1/items/9999")
    assert resp.status_code == 404


# -- Update (PATCH) --

def test_update_item_partial(created_item, client: TestClient):
    item_id = created_item["id"]
    resp = client.patch(f"/api/v1/items/{item_id}", json={"quantity": 5})
    assert resp.status_code == 200
    data = resp.json()
    assert data["quantity"] == 5
    assert data["item_name"] == ITEM_PAYLOAD["item_name"]  # unchanged


def test_update_item_sku(created_item, client: TestClient):
    item_id = created_item["id"]
    resp = client.patch(f"/api/v1/items/{item_id}", json={"sku": "UPD-001"})
    assert resp.status_code == 200
    data = resp.json()
    assert data["sku"] == "UPD-001"


# -- Replace (PUT) --

def test_replace_item(created_item, client: TestClient):
    item_id = created_item["id"]
    new_data = {
        "sku": "PUT-001",
        "item_name": "Keyboard",
        "description": "Mechanical",
        "category": "Electronics",
        "quantity": 20,
        "price": 79.99,
    }
    resp = client.put(f"/api/v1/items/{item_id}", json=new_data)
    assert resp.status_code == 200
    data = resp.json()
    assert data["sku"] == "PUT-001"
    assert data["item_name"] == new_data["item_name"]
    assert data["price"] == new_data["price"]


# -- Delete --

def test_delete_item(created_item, client: TestClient):
    item_id = created_item["id"]
    resp = client.delete(f"/api/v1/items/{item_id}")
    assert resp.status_code == 204

    # Verify it's gone
    resp = client.get(f"/api/v1/items/{item_id}")
    assert resp.status_code == 404


def test_delete_item_not_found(client: TestClient):
    resp = client.delete("/api/v1/items/9999")
    assert resp.status_code == 404
