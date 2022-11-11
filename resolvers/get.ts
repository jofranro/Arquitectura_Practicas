import { ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { slotsCollection } from "../db/database.ts";
import { SlotSchema } from "../db/schemas.ts";
import { getQuery } from "https://deno.land/x/oak/helpers.ts";

type GetAvailabeSlotsContext = RouterContext<
  "/availableSlots",
  Record<string | number, string | undefined>,
  Record<string, any>
>;
export const availableSlots = async (context: GetAvailabeSlotsContext) => {
    try {
      const params = getQuery(context, { mergeParams: true });
      if (!params.year || !params.month) {
        context.response.status = 403;
        return;
      }
      //Cuando los pacientes consultan las citas disponibles además del día, mes y año podrán añadir (o no, es opcional) el id_doctor, para ver las citas disponibles de un doctor particular.
    const {day,month, year, id_doctor} = params; //asignamos a cada variable su valor
    if (!id_doctor && !day) {
      const slots = await slotsCollection
        .find({
          year: parseInt(year),
          month: parseInt(month),
          available: true,
        })
        .toArray();
      context.response.body = context.response.body = slots.map((slot) => {
        const { _id, ...rest } = slot;
        return rest;
      });
    } else if(id_doctor && !day) {
      const slots = await slotsCollection
        .find({
          year: parseInt(year),
          month: parseInt(month),
          id_doctor: id_doctor,
          available: true,
        })
        .toArray();
      context.response.body = slots.map((slot) => {
        const { _id, ...rest } = slot;
        return rest;
      });
    }else if(!id_doctor && day) {
        const slots = await slotsCollection
          .find({
            year: parseInt(year),
            month: parseInt(month),
            day: parseInt(day),
            available: true,
          })
          .toArray();
        context.response.body = context.response.body = slots.map((slot) => {
          const { _id, ...rest } = slot;
          return rest;
        });
      } else if (id_doctor && day) {
        const slots = await slotsCollection
          .find({
            year: parseInt(year),
            month: parseInt(month),
            day: parseInt(day),
            id_doctor: id_doctor,
            available: true,
          })
          .toArray();
        context.response.body = slots.map((slot) => {
          const { _id, ...rest } = slot;
          return rest;
        });
      }  
    } catch (e) {
      console.error(e);
      context.response.status = 500;
    }
  };

  /*
type GetNoAvailabeSlotsContext = RouterContext<
  "/doctorAppointments/:id_doctor",
  {
    id_doctor: string;
  } &
  Record<string | number, string | undefined>,
  Record<string, any>
>;
export const noAvailableSlots = async (context: GetNoAvailabeSlotsContext) => {

}
*/
type GetDocotorApointmentContext = RouterContext<
  "/doctorAppointments/:id_doctor",
  {
    id_doctor: string;
  } & Record<string | number, string | undefined>,
  Record<string, any>
>;
export const doctorAppointments = async (context: GetDocotorApointmentContext) => {
  try {
    const params = getQuery(context, { mergeParams: true });

    const { id_doctor, day, month, year} = params;

    const date = new Date();
    const today = date.getDate();
    const currentMonth = date.getMonth();
    const currentYear = date.getFullYear();
    if (parseInt(year) < currentYear) {
      context.response.status = 403;
      return;
    }
    if (parseInt(month) < currentMonth && parseInt(year) == currentYear) {
      context.response.status = 403;
      return;
    }
    if (parseInt(day) < today && parseInt(month) == currentMonth && parseInt(year) == currentYear) {
      context.response.status = 403;
      return;
    }
    
    const slots = await slotsCollection
      .find({
        id_doctor: id_doctor,
        available: false,
      })
      .toArray();
    context.response.body = slots.map((slot) => {
      const { _id, ...rest } = slot;
      return rest;
    });
   } catch (e) {
    console.error(e);
    context.response.status = 500;
  }
};