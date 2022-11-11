import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { slotsCollection } from "../db/database.ts";
import { SlotSchema } from "../db/schemas.ts";

type PutBookSlotContext = RouterContext<
  "/bookSlot",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

export const bookSlot = async (context: PutBookSlotContext) => {
  try {
    const value = await context.request.body().value;
    if (
      !value.year ||
      !value.month ||
      !value.day ||
      !value.hour ||
      !value.dni  ||
      !value.id_doctor
    ) {
      context.response.status = 406;
      return;
    }
    const { year, month, day, hour, dni, id_doctor } = value;
    const slot = await slotsCollection.findOne({
      year: parseInt(year),
      month: parseInt(month),
      day: parseInt(day),
      hour: parseInt(hour),
      available: true,
      id_doctor: id_doctor
    });
    if (!slot) {
      context.response.status = 404;
      return;
    }
    await slotsCollection.updateOne(
      { _id: slot._id },
      { $set: { available: false, dni } }
    );
    context.response.status = 200;
    const { _id, ...rest } = slot;
    context.response.body = { ...rest, available: false, dni };
  } catch (e) {
    console.error(e);
    context.response.status = 500;
  }
};