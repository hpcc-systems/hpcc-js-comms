//  TODO switch to propper logger  ---

export enum Level {
    debug,
    info,
    notice,
    warning,
    error,
    critical,
    alert,
    emergency
}

export class Logging {
    log(level: Level, msg: string) {
        const d = new Date();
        const n = d.toISOString();
        // tslint:disable-next-line:no-console
        console.log(`${n} <${Level[level]}>:  ${msg}`);
    }

    debug(msg: string) {
        this.log(Level.debug, msg);
    }

    info(msg: string) {
        this.log(Level.info, msg);
    }

    notice(msg: string) {
        this.log(Level.notice, msg);
    }

    warning(msg: string) {
        this.log(Level.warning, msg);
    }

    error(msg: string) {
        this.log(Level.error, msg);
    }

    critical(msg: string) {
        this.log(Level.critical, msg);
    }

    alert(msg: string) {
        this.log(Level.alert, msg);
    }

    emergency(msg: string) {
        this.log(Level.emergency, msg);
    }
}

export let logger = new Logging();
