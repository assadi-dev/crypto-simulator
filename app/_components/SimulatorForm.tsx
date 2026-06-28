"use client";

import { Controller, type UseFormReturn } from "react-hook-form";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { SimulatorInput } from "../dto/simulator.schema";
import { CRYPTO_OPTIONS, FREQUENCY_OPTIONS } from "../_types/simulator";
import { DateField } from "./DateField";

type SimulatorFormProps = {
  form: UseFormReturn<SimulatorInput>;
};

const notInFuture = (date: Date) => date > new Date();

/** Formulaire de saisie (présentationnel). Le calcul est déclenché en temps réel par le parent. */
export function SimulatorForm({ form }: SimulatorFormProps) {
  const {
    register,
    control,
    formState: { errors },
  } = form;

  return (
    <Card className="animate-fade-up fade-delay-3 h-full w-full border-white/10 bg-white/4 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-xl">Simulation</CardTitle>
        <CardDescription>
          Estimez la performance passée d&apos;un placement, en une fois ou de
          façon récurrente (DCA).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-5" noValidate>
          {/* Cryptomonnaie */}
          <div className="grid gap-2">
            <Label htmlFor="crypto">Cryptomonnaie</Label>
            <Controller
              control={control}
              name="crypto"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="crypto" className="w-full">
                    <SelectValue placeholder="Choisir une cryptomonnaie" />
                  </SelectTrigger>
                  <SelectContent>
                    {CRYPTO_OPTIONS.map((crypto) => (
                      <SelectItem key={crypto.id} value={crypto.id}>
                        {crypto.label}
                        <span className="text-muted-foreground">
                          {crypto.symbol}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError message={errors.crypto?.message} />
          </div>

          {/* Montant */}
          <div className="grid gap-2">
            <Label htmlFor="amount">Montant investi (€)</Label>
            <Input
              id="amount"
              type="number"
              min={1}
              step="any"
              inputMode="decimal"
              className="h-10"
              {...register("amount", { valueAsNumber: true })}
            />
            <FieldError message={errors.amount?.message} />
          </div>

          {/* Fréquence */}
          <div className="grid gap-2">
            <Label htmlFor="frequency">Fréquence d&apos;investissement</Label>
            <Controller
              control={control}
              name="frequency"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="frequency" className="w-full">
                    <SelectValue placeholder="Choisir une fréquence" />
                  </SelectTrigger>
                  <SelectContent>
                    {FREQUENCY_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError message={errors.frequency?.message} />
          </div>

          {/* Période */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="startDate">Date de début</Label>
              <Controller
                control={control}
                name="startDate"
                render={({ field }) => (
                  <DateField
                    id="startDate"
                    value={field.value}
                    onChange={field.onChange}
                    disabled={notInFuture}
                  />
                )}
              />
              <FieldError message={errors.startDate?.message} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="endDate">Date de fin</Label>
              <Controller
                control={control}
                name="endDate"
                render={({ field }) => (
                  <DateField
                    id="endDate"
                    value={field.value}
                    onChange={field.onChange}
                    disabled={notInFuture}
                  />
                )}
              />
              <FieldError message={errors.endDate?.message} />
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-sm text-destructive">{message}</p>;
}
