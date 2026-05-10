"use server";

export type SubscribeState = {
  ok: boolean;
  message: string;
};

export async function subscribeForUpdates(_email: string): Promise<SubscribeState> {
  return {
    ok: true,
    message: "Thank you. Updates will be added when the nonprofit content program opens.",
  };
}
