"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  useCreateBuilding,
  useCreateFlat,
  useCreateRoom,
  useDeleteBuilding,
  useDeleteFlat,
  useDeleteProperty,
  useDeleteRoom,
  useProperty,
  useUpdateBuilding,
  useUpdateFlat,
  useUpdateProperty,
  useUpdateRoom,
} from "@/hooks";
import { getErrorMessage } from "@/lib/apiClient";
import type { Building, Flat, Room } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmButton, FormDialog, type FieldDef } from "@/components/modules/common";
import { formatDate, formatMoney, toIso } from "@/utils/format.util";

const onError = (e: unknown) => toast.error(getErrorMessage(e));

const propertyFields: FieldDef[] = [
  { name: "title", label: "Title", required: true },
  { name: "description", label: "Description", type: "textarea", required: true },
  { name: "address", label: "Address", required: true },
  { name: "city", label: "City", required: true },
];
const buildingFields: FieldDef[] = [
  { name: "name", label: "Building name", required: true },
  { name: "floors", label: "Floors", type: "number", min: 1, required: true },
  { name: "address", label: "Address", required: true },
  { name: "city", label: "City", required: true },
];
const flatFields: FieldDef[] = [
  { name: "flatNumber", label: "Flat number", required: true },
  { name: "floor", label: "Floor", type: "number", min: 0, required: true },
];
const roomFields: FieldDef[] = [
  { name: "name", label: "Room name", required: true },
  { name: "price", label: "Monthly price (BDT)", type: "number", min: 1, required: true },
  { name: "availableFrom", label: "Available from", type: "date" },
  { name: "availableTo", label: "Available to", type: "date" },
  { name: "isActive", label: "Listed / available for applications", type: "checkbox" },
];

function RoomRow({ room }: { room: Room }) {
  const update = useUpdateRoom();
  const remove = useDeleteRoom();
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border bg-background p-2 text-sm">
      <div className="flex items-center gap-2">
        <span className="font-medium">{room.name}</span>
        <span className="text-muted-foreground">{formatMoney(room.price)}/mo</span>
        <Badge variant={room.isActive ? "default" : "secondary"}>{room.isActive ? "Active" : "Inactive"}</Badge>
        {room.availableFrom && <span className="text-xs text-muted-foreground">from {formatDate(room.availableFrom)}</span>}
      </div>
      <div className="flex gap-2">
        <FormDialog
          triggerLabel="Edit"
          triggerProps={{ size: "xs", variant: "outline" }}
          title={`Edit ${room.name}`}
          fields={roomFields}
          initial={{ name: room.name, price: String(room.price ?? ""), availableFrom: room.availableFrom?.slice(0, 10) ?? "", availableTo: room.availableTo?.slice(0, 10) ?? "", isActive: room.isActive }}
          pending={update.isPending}
          onSubmit={(v, done) =>
            update.mutate(
              { id: room.id, name: String(v.name), price: Number(v.price), availableFrom: toIso(String(v.availableFrom)), availableTo: toIso(String(v.availableTo)), isActive: !!v.isActive },
              { onSuccess: () => { toast.success("Room updated"); done(); }, onError },
            )
          }
        />
        <ConfirmButton size="xs" variant="destructive" title={`Delete ${room.name}?`} confirmLabel="Delete" pending={remove.isPending} onConfirm={() => remove.mutate(room.id, { onSuccess: () => toast.success("Room deleted"), onError })}>
          Delete
        </ConfirmButton>
      </div>
    </div>
  );
}

function FlatBlock({ flat }: { flat: Flat }) {
  const createRoom = useCreateRoom();
  const update = useUpdateFlat();
  const remove = useDeleteFlat();
  return (
    <div className="space-y-2 rounded-md border p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-medium">Flat {flat.flatNumber}{flat.floor !== undefined && <span className="text-sm font-normal text-muted-foreground"> · Floor {flat.floor}</span>}</p>
        <div className="flex gap-2">
          <FormDialog
            triggerLabel="+ Room"
            triggerProps={{ size: "xs" }}
            title={`Add room to flat ${flat.flatNumber}`}
            fields={roomFields}
            initial={{ isActive: true }}
            pending={createRoom.isPending}
            submitLabel="Create room"
            onSubmit={(v, done) =>
              createRoom.mutate(
                { flatId: flat.id, name: String(v.name), price: Number(v.price), availableFrom: toIso(String(v.availableFrom)), availableTo: toIso(String(v.availableTo)), isActive: !!v.isActive },
                { onSuccess: () => { toast.success("Room created"); done(); }, onError },
              )
            }
          />
          <FormDialog
            triggerLabel="Edit"
            triggerProps={{ size: "xs", variant: "outline" }}
            title={`Edit flat ${flat.flatNumber}`}
            fields={flatFields}
            initial={{ flatNumber: flat.flatNumber, floor: String(flat.floor ?? 0) }}
            pending={update.isPending}
            onSubmit={(v, done) =>
              update.mutate({ id: flat.id, flatNumber: String(v.flatNumber), floor: Number(v.floor) }, { onSuccess: () => { toast.success("Flat updated"); done(); }, onError })
            }
          />
          <ConfirmButton size="xs" variant="destructive" title={`Delete flat ${flat.flatNumber}?`} description="Its rooms will be removed too." confirmLabel="Delete" pending={remove.isPending} onConfirm={() => remove.mutate(flat.id, { onSuccess: () => toast.success("Flat deleted"), onError })}>
            Delete
          </ConfirmButton>
        </div>
      </div>
      <div className="space-y-2">
        {flat.rooms.length === 0 ? <p className="text-sm text-muted-foreground">No rooms yet.</p> : flat.rooms.map((r) => <RoomRow key={r.id} room={r} />)}
      </div>
    </div>
  );
}

function BuildingBlock({ building }: { building: Building }) {
  const createFlat = useCreateFlat();
  const update = useUpdateBuilding();
  const remove = useDeleteBuilding();
  const flats = building.flats.filter((f) => !f.deletedAt);
  return (
    <Card>
      <CardContent className="space-y-3 p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="font-semibold">{building.name}</h3>
            <p className="text-sm text-muted-foreground">{building.address}, {building.city} · {building.floors ?? 1} floor(s)</p>
          </div>
          <div className="flex gap-2">
            <FormDialog
              triggerLabel="+ Flat"
              triggerProps={{ size: "sm" }}
              title={`Add flat to ${building.name}`}
              fields={flatFields}
              initial={{ floor: "0" }}
              pending={createFlat.isPending}
              submitLabel="Create flat"
              onSubmit={(v, done) =>
                createFlat.mutate({ buildingId: building.id, flatNumber: String(v.flatNumber), floor: Number(v.floor) }, { onSuccess: () => { toast.success("Flat created"); done(); }, onError })
              }
            />
            <FormDialog
              triggerLabel="Edit"
              triggerProps={{ size: "sm", variant: "outline" }}
              title={`Edit ${building.name}`}
              fields={buildingFields}
              initial={{ name: building.name, floors: String(building.floors ?? 1), address: building.address ?? "", city: building.city ?? "" }}
              pending={update.isPending}
              onSubmit={(v, done) =>
                update.mutate({ id: building.id, name: String(v.name), floors: Number(v.floors), address: String(v.address), city: String(v.city) }, { onSuccess: () => { toast.success("Building updated"); done(); }, onError })
              }
            />
            <ConfirmButton size="sm" variant="destructive" title={`Delete ${building.name}?`} description="All its flats and rooms will be removed too." confirmLabel="Delete" pending={remove.isPending} onConfirm={() => remove.mutate(building.id, { onSuccess: () => toast.success("Building deleted"), onError })}>
              Delete
            </ConfirmButton>
          </div>
        </div>
        {flats.length === 0 ? <p className="text-sm text-muted-foreground">No flats yet.</p> : <div className="space-y-3">{flats.map((f) => <FlatBlock key={f.id} flat={{ ...f, rooms: f.rooms ?? [] }} />)}</div>}
      </CardContent>
    </Card>
  );
}

export default function ManagePropertyPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data, isLoading, error } = useProperty(id);
  const updateProperty = useUpdateProperty();
  const deleteProperty = useDeleteProperty();
  const createBuilding = useCreateBuilding();
  const property = data?.data;

  if (isLoading) return <Skeleton className="h-64 w-full" />;
  if (error || !property) return <p className="text-destructive">{error ? getErrorMessage(error) : "Property not found."}</p>;

  const buildings = (property.buildings ?? []).filter((b) => !b.deletedAt);

  return (
    <div>
      <Link href="/landlord/properties" className="text-sm text-primary">← Back to properties</Link>
      <div className="mb-6 mt-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{property.title}</h1>
          <p className="text-sm text-muted-foreground">{property.address}, {property.city}</p>
          <p className="mt-2 max-w-2xl text-sm">{property.description}</p>
        </div>
        <div className="flex gap-2">
          <FormDialog
            triggerLabel="Edit property"
            triggerProps={{ variant: "outline" }}
            title="Edit property"
            fields={propertyFields}
            initial={{ title: property.title, description: property.description, address: property.address, city: property.city }}
            pending={updateProperty.isPending}
            onSubmit={(v, done) =>
              updateProperty.mutate(
                { id, title: String(v.title), description: String(v.description), address: String(v.address), city: String(v.city) },
                { onSuccess: () => { toast.success("Property updated"); done(); }, onError },
              )
            }
          />
          <ConfirmButton variant="destructive" title="Delete this property?" description="Buildings, flats and rooms under it will be removed." confirmLabel="Delete property" pending={deleteProperty.isPending} onConfirm={() => deleteProperty.mutate(id, { onSuccess: () => { toast.success("Property deleted"); router.push("/landlord/properties"); }, onError })}>
            Delete
          </ConfirmButton>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Buildings</h2>
        <FormDialog
          triggerLabel="+ Add building"
          title="Add building"
          fields={buildingFields}
          initial={{ floors: "1", address: property.address, city: property.city }}
          pending={createBuilding.isPending}
          submitLabel="Create building"
          onSubmit={(v, done) =>
            createBuilding.mutate(
              { propertyId: id, name: String(v.name), floors: Number(v.floors), address: String(v.address), city: String(v.city) },
              { onSuccess: () => { toast.success("Building created"); done(); }, onError },
            )
          }
        />
      </div>
      {buildings.length === 0 ? (
        <p className="text-muted-foreground">No buildings yet. Add a building, then flats, then rooms tenants can apply for.</p>
      ) : (
        <div className="space-y-4">{buildings.map((b) => <BuildingBlock key={b.id} building={b} />)}</div>
      )}
    </div>
  );
}
