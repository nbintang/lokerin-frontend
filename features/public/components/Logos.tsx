import { ShinyText } from '@/components/ShinyText'
import { Badge } from '@/components/ui/badge'
import { IconBrandAppleFilled, IconBrandAws, IconBrandGoogle, IconBrandMeta, IconBrandOpenai, IconBrandX } from '@tabler/icons-react'
import React from 'react'

export const Logos = () => {
  return (
          <section className="w-full flex items-center justify-center py-12 border-y bg-muted/30">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <Badge className="text-sm font-medium text-muted-foreground" variant={"secondary"}>
                 <ShinyText text='Trusted By' disabled={false} />
                </Badge>
                <div className="flex flex-wrap mt-3 items-center justify-center gap-8 md:gap-12 lg:gap-16">
                  {[
                    IconBrandMeta,
                    IconBrandGoogle,
                    IconBrandX,
                    IconBrandOpenai,
                    IconBrandAws,
                    IconBrandAppleFilled,
                  ].map((Icon, i) => (
                    <Icon
                      key={i}
                      className="size-14 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>

  )
}
