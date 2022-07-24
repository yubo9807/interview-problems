import { AnyObj } from '../utils/type';
import { dataCheck, isNotEmpty, isType, errorSet, dataLength, regExp } from '../utils/decorate';
import { throwError } from '../services/error-deal-with';
import { Context } from 'koa';

export default (data: AnyObj) => {
  errorSet.clear();
  
  const USERNAME = 'username';
  const PASSWORD = 'password';

  @dataCheck(data)
  class Data {
    
    @isType('string')
    @isNotEmpty
    static [USERNAME] = data.username;
    
    
    @isType('string')
    @isNotEmpty
    static [PASSWORD] = data.password;

  }


  return (ctx: Context) => {
    {
      // 基本参数类型校验
      const error = [...errorSet][0];
      error && throwError(ctx, 406, `params error, ${error}`);
    }

    {
      // 用户名长度校验
      dataLength(5, 20)(Data, USERNAME);
      const error = [...errorSet][0];
      error && throwError(ctx, 401, error as string);
    }

    {
      regExp(/^[a-z|_]/)(Data, USERNAME);
      const error = [...errorSet][0];
      error && throwError(ctx, 401, '用户名必须由小写英文字母/数字/下划线组成，并且不能以数字开头');
    }

    {
      // 密码长度校验
      dataLength(6, Infinity)(Data, PASSWORD);
      const error = [...errorSet][0];
      error && throwError(ctx, 401, error as string);
    }

    {
      const reg = /([a-zA-Z]\d)|\d[a-zA-Z]|([a-z][A-Z])|([A-Z][a-z])/g;
      regExp(reg)(Data, PASSWORD);
      const error = [...errorSet][0];
      error && throwError(ctx, 401, '密码须包含大写，小写，数字至少二项');
    }
  }

}