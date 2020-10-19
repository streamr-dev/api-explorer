import axios, {AxiosPromise} from 'axios';
import {Parameter} from 'swagger-schema-official';
import {IExtra} from '../interfaces/IExtra';
import {IOperationExtended} from '../interfaces/IOperationExtended';
import {IParameterExtended} from '../interfaces/IParameterExtended';
import {ISpecExtended} from '../interfaces/ISpecExtended';
import {store} from '../../../../store'

export function configure(operation: IOperationExtended, spec: ISpecExtended) {
  let path: string = operation._pathName;
  const query: IExtra = {};
  const headers: IExtra = {};
  let body: any = null;

  headers['Content-Type'] = operation._._produces;

  for (const param of (operation.parameters as Parameter[]) || []) {
    // This is my 1st as-any-as ever! :-)))
    const value = (param as any as IParameterExtended)._._value;

    if (!value || (!value && (param.in !== 'path'))) {
      continue;
    }

    switch (param.in as string) {
      case 'query':
        query[param.name] = value;
        break;
      case 'path':
        path = path.replace('{' + param.name + '}', encodeURIComponent(value));
        break;
      case 'header':
        headers[param.name] = value;
        break;
      case 'formData':
        headers['Content-Type'] = 'multipart/form-data';
        const formData = new FormData();
        const imagefile = document.querySelector('#'+window.streamrFileUploadId)
        formData.append("file", imagefile.files[0])
        body = formData
        break;
      case 'body':
        body = body || value;
        break;
    }
  }

  // Streamr Token injection
  let streamrToken = store.state.settings.token

  if (streamrToken !== "" && !streamrToken.startsWith("Bearer ")) {
    streamrToken = `Bearer ${streamrToken}`
  }

  let config: any = {
    method: operation._method,
    url: spec._._scheme + '://' + merge(merge(spec.host, spec.basePath), path),
    headers: {
      'Content-Type': 'application/json',
      authorization: streamrToken
    },
  };

  if (Object.keys(query).length) {
    config.params = query;
  }

  if (body) {
    config.data = body;
  }

  return config;
}

function merge(a = '', b = '') {
  if (!a || !b) {
    return a + b;
  } else if (a[a.length - 1] === '/' && b[0] === '/') {
    return a + b.substr(1);
  } else if (a[a.length - 1] !== '/' && b[0] !== '/') {
    return a + '/' + b;
  } else {
    return a + b;
  }
}

export function execute(operation: IOperationExtended, spec: ISpecExtended): AxiosPromise {
  const config = configure(operation, spec);
  return axios.request(config);
}
