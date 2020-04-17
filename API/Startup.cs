using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Graphql.Values;
using Application.Values;
using HotChocolate;
using HotChocolate.AspNetCore;
using HotChocolate.Subscriptions;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Persistence;
using Domain;
using Microsoft.AspNetCore.Identity;
using Application.Interfaces;
using Infrastructure.Security;
using API.User.Graphql;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using AutoMapper;

namespace API
{

    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        //   public void ConfigureDevelopmentServices(IServiceCollection services)
        // {
        //     services.AddDbContext<DataContext>(opt =>
        //     {
        //         opt.UseLazyLoadingProxies();
        //         opt.UseSqlite(Configuration.GetConnectionString("DefaultConnection"));
        //     });

        //     ConfigureServices(services);
        // }

        // public void ConfigureProductionServices(IServiceCollection services)
        // {
        //     services.AddDbContext<DataContext>(opt =>
        //     {
        //         opt.UseLazyLoadingProxies();
        //         opt.UseSqlServer(Configuration.GetConnectionString("DefaultConnection"));
        //     });

        //     ConfigureServices(services);
        // }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<DataContext>(opt =>
            {
                // opt.UseLazyLoadingProxies();
                opt.UseSqlite(Configuration.GetConnectionString("DefaultConnection"));
            });
            // ConfigureServices(services);
            services.AddCors(opt =>
           {
               opt.AddPolicy("CorsPolicy", policy =>
         {
             policy.AllowAnyHeader()
             .AllowAnyMethod()
             .AllowCredentials()
             .WithExposedHeaders("WWW-Authenticate")
             .WithOrigins("http://localhost:3000");


         });
           });
            services.AddAutoMapper(typeof(List.Handler));
            services.AddMediatR(typeof(List.Handler).Assembly);

            services.AddInMemorySubscriptionProvider();

            var builder = services.AddIdentityCore<AppUser>();
            var identityBuilder = new IdentityBuilder(builder.UserType, builder.Services);
            identityBuilder.AddEntityFrameworkStores<DataContext>();
            identityBuilder.AddSignInManager<SignInManager<AppUser>>();

            //      services.AddAuthorization(opt =>
            //     {
            //         opt.AddPolicy("IsActivityHost", policy =>
            //   {
            //       policy.Requirements.Add(new IsHostRequirement());
            //   });
            //     });

            //     services.AddTransient<IAuthorizationHandler, IsHostRequirementHandler>();


            // add authentication
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["TokenKey"]));

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(opt =>
         {
             opt.TokenValidationParameters = new TokenValidationParameters
             {
                 ValidateIssuerSigningKey = true,
                 IssuerSigningKey = key,
                 ValidateAudience = false,
                 ValidateIssuer = false,
                 ValidateLifetime = true,
                 ClockSkew = TimeSpan.Zero
             };
             // opt.Events = new JwtBearerEvents
             // {
             //     OnMessageReceived = context =>
             //     {
             //         var accessToken = context.Request.Query["access_token"];
             //         var path = context.HttpContext.Request.Path;
             //         if (!string.IsNullOrEmpty(accessToken) && (path.StartsWithSegments("/chat")))
             //         {
             //             context.Token = accessToken;
             //         }
             //         return Task.CompletedTask;
             //     }
             // };
         });

            services.AddScoped<IUserAccessor, UserAccessor>();
            services.AddScoped<IJwtGenerator, JwtGenerator>();

            services.AddDataLoaderRegistry().AddGraphQL(sp => SchemaBuilder.New()
                 .AddServices(sp)
                 .AddQueryType(d => d.Name("Query"))
                 .AddMutationType(d => d.Name("Mutation"))
                 .AddSubscriptionType(d => d.Name("Subscription"))
                 .AddType<ValueQueries>()
                 .AddType<UserQueries>()
                 .AddType<UserMutations>()
                 .AddType<ValueMutations>()
                 .AddType<ValueSubscriptions>()
                 .AddAuthorizeDirectiveType()
                 .Create());

            // services.AddGraphQL(
            //         SchemaBuilder.New()
            //             .AddQueryType<Query>());

            //add authorization to all endpoints
            services.AddControllers(opt =>
            {
                var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
                opt.Filters.Add(new AuthorizeFilter(policy));
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, ILogger<Startup> logger)
        {
            logger.LogInformation("hello");

            // if (env.IsDevelopment())
            // {
            //     app.UseDeveloperExceptionPage();
            // }

            // app.UseHttpsRedirection();

            // app.UseRouting();
            app.UseAuthentication();
            // app.UseAuthorization();
            app.UseCors("CorsPolicy");
            app
             //  .UseRouting()
             .UseWebSockets()
             .UseGraphQL("/graphql");
            app.UsePlayground();


            // app.UseEndpoints(endpoints =>
            // {
            //     endpoints.MapControllers();
            // });
        }
    }
}
