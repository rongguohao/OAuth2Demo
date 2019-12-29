// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.


using IdentityServer4.Models;
using System.Collections.Generic;
using IdentityServer4;

namespace Idp
{
    public static class Config
    {
        /// <summary>
        /// 可访问的用户资源种类
        /// </summary>
        public static IEnumerable<IdentityResource> Ids =>
            new IdentityResource[]
            {
                new IdentityResources.OpenId(),
                new IdentityResources.Profile(),
                new IdentityResources.Address(),
                new IdentityResources.Phone(),
                new IdentityResources.Email(),
            };

        /// <summary>
        /// 受保护的Api信息
        /// </summary>
        public static IEnumerable<ApiResource> Apis =>
            new ApiResource[]
            {
                new ApiResource("api1", "My API #1")
                {
                    ApiSecrets  = { new Secret("api1 secret".Sha256()) }
                }
            };

        /// <summary>
        /// 客户端信息
        /// </summary>
        public static IEnumerable<Client> Clients =>
            new Client[]
            {
                new Client()
                {
                    //客户端Id
                    ClientId="1",
                    ClientName="client1",
                    //客户端密码
                    ClientSecrets={new Secret("client1secret".Sha256()) },
                    //客户端授权类型，Code:授权码模式
                    AllowedGrantTypes=GrantTypes.Code,
                    //允许登录后重定向的地址列表
                    RedirectUris = { "http://localhost:5007/signin-oidc" },

                    FrontChannelLogoutUri = "http://localhost:5007/signout-oidc",
                    PostLogoutRedirectUris = { "http://localhost:5007/signout-callback-oidc" },

                    AlwaysIncludeUserClaimsInIdToken = true,
                    AllowOfflineAccess = true, 
                    AccessTokenLifetime = 60,

                    AllowedScopes =
                    {
                        "api1",
                        IdentityServerConstants.StandardScopes.OpenId,
                        IdentityServerConstants.StandardScopes.Email,
                        IdentityServerConstants.StandardScopes.Address,
                        IdentityServerConstants.StandardScopes.Phone,
                        IdentityServerConstants.StandardScopes.Profile
                    }
                },

                new Client()
                {
                    ClientId = "2",
                    ClientName = "client2",
                    ClientUri = "http://localhost:4200",
                    ClientSecrets = {new Secret("client2secret".Sha256())},

                    AllowedGrantTypes = GrantTypes.Code, //授权码模式
                    RequireConsent = false, // 勾选授权内容页面 默认为true 
                    AccessTokenLifetime = 7200, // token有效期
                    AuthorizationCodeLifetime = 3600, // code 有效期

                    RedirectUris = {"http://localhost:4200/#/signin-oidc"},

                    //浏览器端跨域设置
                    AllowedCorsOrigins =
                    {
                        "http://localhost:4200"
                    },

                    AlwaysIncludeUserClaimsInIdToken = true,

                    AllowOfflineAccess = true, 

                    AllowedScopes =
                    {
                        "api1",
                        IdentityServerConstants.StandardScopes.OpenId,
                        IdentityServerConstants.StandardScopes.Email,
                        IdentityServerConstants.StandardScopes.Address,
                        IdentityServerConstants.StandardScopes.Phone,
                        IdentityServerConstants.StandardScopes.Profile
                    }
                }
            };
    }
}