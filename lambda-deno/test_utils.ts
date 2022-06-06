type EnvVars = {
  [index: string]: string;
};

export class TempEnv {
  static append(envs: EnvVars): TempEnv {
    return this.setEnvVars(envs, false);
  }

  static replace(envs: EnvVars): TempEnv {
    return this.setEnvVars(envs, true);
  }

  static appended<T>(envs: EnvVars, f: () => T): T {
    const tmpEnv = this.append(envs);
    try {
      return f();
    } finally {
      tmpEnv.restore();
    }
  }

  static replaced<T>(envs: EnvVars, f: () => T): T {
    const tmpEnv = this.replace(envs);
    try {
      return f();
    } finally {
      tmpEnv.restore();
    }
  }

  private static setEnvVars(set: EnvVars, clear: boolean): TempEnv {
    const original = Deno.env.toObject();
    if (clear) {
      Object.entries(original).forEach(([name, _]) => Deno.env.delete(name));
    }
    Object.entries(set).forEach(([name, value]) => Deno.env.set(name, value));
    return new TempEnv(original);
  }

  constructor(private original: EnvVars) {
  }

  public restore(): void {
    Object.entries(Deno.env.toObject()).forEach(([name, _]) =>
      Deno.env.delete(name)
    );
    Object.entries(this.original).forEach(([name, value]) =>
      Deno.env.set(name, value)
    );
  }
}
