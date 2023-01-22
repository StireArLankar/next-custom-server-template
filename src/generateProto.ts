import { spawnSync } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import { resolve } from 'path';

import glob from 'glob';

const protocVersion = '3.18.1';

const defaultPlatform = {
  downloadSuffix: 'linux-x86_64',
  name: 'Linux',
};

/** настройки для определения версии перед скачиванием `protoc` */
const supportedPlatforms: Record<NodeJS.Platform, typeof defaultPlatform> = {
  darwin: {
    downloadSuffix: 'osx-x86_64',
    name: 'Mac',
  },
  linux: {
    downloadSuffix: 'linux-x86_64',
    name: 'Linux',
  },
  win32: {
    downloadSuffix: 'win32',
    name: 'Windows',
  },
  aix: defaultPlatform,
  android: defaultPlatform,
  cygwin: defaultPlatform,
  freebsd: defaultPlatform,
  netbsd: defaultPlatform,
  openbsd: defaultPlatform,
  sunos: defaultPlatform,
  haiku: defaultPlatform,
};

const platform = supportedPlatforms[process.platform];
const platformName = platform ? platform.name : `UNKNOWN:${process.platform}`;

console.log('You appear to be running on', platformName);

/** рут проекта */
const rootPath = process.cwd();
/** папка, где лежат .proto файлы */
const sourcePath = resolve(rootPath, 'proto');
/** папка, где лежат будут лежать сгенерированные файлы */
const generatedPath = resolve(rootPath, 'src', 'generated');

/** суффикс для вызова плагинов, на винде добавляем `.cmd` */
const binSuffix = process.platform === 'win32' ? '.cmd' : '';
/** папка с бинарниками внутри `node_modules` */
const nodeModulesBin = resolve(rootPath, 'node_modules', '.bin');
/** путь до бинарника CLI-пакета для скачивания файлов  - `download` */
const downloadPath = resolve(nodeModulesBin, 'download') + binSuffix;
/** путь до плагина кодогенератора */
const protocPluginPath =
  resolve(nodeModulesBin, 'protoc-gen-ts_proto') + binSuffix;
/** путь до `rimraf`, которым будут удалены скаченные файлы */
const rimrafPath = resolve(nodeModulesBin, 'rimraf') + binSuffix;

/** папка, куда будут сложены скаченные и развернутые из архива файлы */
const tempPath = resolve(rootPath, '_tmp_');
/** путь до вытащенного из архива `protoc` бинарника */
const protocPath = resolve(tempPath, 'bin', 'protoc');

/** скачиваем бинарник из репозитория `protoc` */
requireProtoc();

/** подготавливаем папку для сгенерированных файлов */
requireDir(generatedPath);

/** генерируем файлы */
generateFiles();

/** удаляем скаченные файлы */
run(rimrafPath, tempPath);

/** функция для скачивания `protoc` */
function requireProtoc() {
  if (existsSync(protocPath)) {
    return;
  }

  if (!platform) {
    const msg = `Cannot download protoc.${platformName} is not currently supported by ts-protoc-gen`;
    throw new Error(msg);
  }

  console.log(`Downloading protoc v${protocVersion} for ${platform.name}`);

  const protocUrl = `https://github.com/google/protobuf/releases/download/v${protocVersion}/protoc-${protocVersion}-${platform.downloadSuffix}.zip`;

  run(downloadPath, '--extract', '--out', tempPath, protocUrl);
}

function requireDir(path: string) {
  if (existsSync(path)) {
    run(rimrafPath, path);
  }

  mkdirSync(path);
}

function run(executablePath: string, ...args: string[]) {
  const result = spawnSync(executablePath, args, {
    shell: true,
    stdio: 'inherit',
  });

  if (result.status !== 0) {
    const msg = `Exited ${executablePath} with status ${result.status}`;
    throw new Error(msg);
  }
}

/** генерируем файлы */
function generateFiles() {
  /**
   * меняет
   * ```ts
   *  type a = { field: string | undefined }
   * ```
   * на
   * ```ts
   *  type a = { field?: string }
   * ```
   * */
  const option_useOptionsls = `--ts_proto_opt=useOptionals=none`;

  /** выбор имплементации `grpc`-сервисов */
  const option_outputServices = `--ts_proto_opt=outputServices=nice-grpc,outputServices=generic-definitions`;

  /**
   * раскидывает плоско сгенерированные через `oneof` поля
   * ```ts
   *  type a = { option1: string | undefined, option2: string | undefined }
   * ```
   * по общей структуре с полем для свича
   * ```ts
   *  type a = {
   *      option:
   *          | { $case: "option1", option1: string }
   *          | { $case: "option2", option2: string }
   *  }
   * ```
   */
  const option_oneof = `--ts_proto_opt=oneof=unions`;

  const paths = glob.sync('proto/**/*.proto').map((a) => resolve(a));

  /** генерируем файлы */
  run(
    protocPath,
    `--proto_path=${sourcePath}`,
    `--plugin=${protocPluginPath}`,
    `--ts_proto_out=${generatedPath}`,
    /** чтоб сгенерированный код не ругался на дурацкую проверку */
    `--ts_proto_opt=esModuleInterop=true`,
    `--ts_proto_opt=returnObservable=true`,
    `--ts_proto_opt=stringEnums=true`,
    `--ts_proto_opt=enumsAsLiterals=true`,
    option_useOptionsls,
    option_outputServices,
    option_oneof,
    //@ts-ignore
    ...paths
  );
}
